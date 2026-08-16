import { useEffect, useState } from "react";

import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

import { useDispatch, useSelector } from "react-redux";

import { db } from "../../firebase/config";

import {
  setVotes,
  setLoading,
  setError,
} from "../../features/voting/voteSlice";

function Voting() {
  const [selectedMeal, setSelectedMeal] = useState("");
  const [timeLeft, setTimeLeft] = useState(null);
  const [votingLoaded, setVotingLoaded] = useState(false);

  const dispatch = useDispatch();

  const votes = useSelector(
    (state) => state.vote.votes
  );

  const loading = useSelector(
    (state) => state.vote.loading
  );

  const error = useSelector(
    (state) => state.vote.error
  );

  // =====================================================
  // MEAL OPTIONS
  // =====================================================

  const mealOptions = [
    {
      id: "pizza",
      name: "Pizza",
      emoji: "🍕",
    },
    {
      id: "burger",
      name: "Burger",
      emoji: "🍔",
    },
    {
      id: "chowmein",
      name: "Chowmein",
      emoji: "🍜",
    },
    {
      id: "biryani",
      name: "Biryani",
      emoji: "🍗",
    },
  ];

  // =====================================================
  // REAL-TIME VOTES
  // =====================================================

  useEffect(() => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const votesRef = collection(db, "votes");

    const unsubscribe = onSnapshot(
      votesRef,
      (snapshot) => {
        const voteList = snapshot.docs.map(
          (voteDoc) => {
            const data = voteDoc.data();

            return {
              id: voteDoc.id,

              mealId: data.mealId || "",

              // Convert Firebase Timestamp
              // into a normal number for Redux
              createdAt:
                data.createdAt?.toMillis?.() ||
                null,
            };
          }
        );

        dispatch(setVotes(voteList));
        dispatch(setLoading(false));
      },

      (error) => {
        console.error(
          "Error fetching votes:",
          error
        );

        dispatch(setError(error.message));
        dispatch(setLoading(false));
      }
    );

    return () => unsubscribe();
  }, [dispatch]);

  // =====================================================
  // GET VOTING SETTINGS
  //
  // Firestore:
  //
  // votingSettings
  //    └── currentVote
  //          └── endAt: Timestamp
  //
  // =====================================================

  useEffect(() => {
    const votingSettingsRef = doc(
      db,
      "votingSettings",
      "currentVote"
    );

    const unsubscribe = onSnapshot(
      votingSettingsRef,

      (snapshot) => {
        // Document doesn't exist
        if (!snapshot.exists()) {
          console.error(
            "Voting settings document does not exist."
          );

          setVotingLoaded(true);
          setTimeLeft(0);

          dispatch(
            setError(
              "Voting settings not found. Create votingSettings/currentVote in Firestore."
            )
          );

          return;
        }

        const data = snapshot.data();

        // endAt doesn't exist
        if (!data.endAt) {
          console.error(
            "Voting endAt field is missing."
          );

          setVotingLoaded(true);
          setTimeLeft(0);

          dispatch(
            setError(
              "Voting deadline is not configured."
            )
          );

          return;
        }

        // Firebase Timestamp → milliseconds

        const endTime =
          data.endAt.toMillis();

        const currentTime = Date.now();

        const remainingSeconds = Math.max(
          0,
          Math.floor(
            (endTime - currentTime) / 1000
          )
        );

        setTimeLeft(
          remainingSeconds
        );

        setVotingLoaded(true);

        dispatch(setError(null));
      },

      (error) => {
        console.error(
          "Error fetching voting settings:",
          error
        );

        setVotingLoaded(true);
        setTimeLeft(0);

        dispatch(
          setError(error.message)
        );
      }
    );

    return () => unsubscribe();
  }, [dispatch]);

  // =====================================================
  // COUNTDOWN
  // =====================================================

  useEffect(() => {
    if (
      !votingLoaded ||
      timeLeft === null ||
      timeLeft <= 0
    ) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previousTime) => {
        if (
          previousTime === null ||
          previousTime <= 1
        ) {
          clearInterval(timer);

          return 0;
        }

        return previousTime - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [votingLoaded, timeLeft]);

  // =====================================================
  // SUBMIT VOTE
  // =====================================================

  const handleVote = async () => {
    if (!votingLoaded) {
      dispatch(
        setError(
          "Please wait while voting information loads."
        )
      );

      return;
    }

    if (timeLeft === null || timeLeft <= 0) {
      dispatch(
        setError(
          "Voting has ended."
        )
      );

      return;
    }

    if (!selectedMeal) {
      dispatch(
        setError(
          "Please select a meal first."
        )
      );

      return;
    }

    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      await addDoc(
        collection(db, "votes"),
        {
          mealId: selectedMeal,

          createdAt:
            serverTimestamp(),
        }
      );

      setSelectedMeal("");

    } catch (error) {
      console.error(
        "Error submitting vote:",
        error
      );

      dispatch(
        setError(error.message)
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  // =====================================================
  // GET VOTE COUNT
  // =====================================================

  const getVoteCount = (mealId) => {
    return votes.filter(
      (vote) =>
        vote.mealId === mealId
    ).length;
  };

  // =====================================================
  // TOTAL VOTES
  // =====================================================

  const totalVotes = votes.length;

  // =====================================================
  // HIGHEST VOTE COUNT
  // =====================================================

  const highestVoteCount =
    mealOptions.length > 0
      ? Math.max(
          ...mealOptions.map(
            (meal) =>
              getVoteCount(meal.id)
          )
        )
      : 0;

  // =====================================================
  // WINNERS
  // =====================================================

  const winners =
    highestVoteCount > 0
      ? mealOptions.filter(
          (meal) =>
            getVoteCount(meal.id) ===
            highestVoteCount
        )
      : [];

  const isTie =
    winners.length > 1;

  // =====================================================
  // TRENDING MEAL
  // =====================================================

  const trendingMeal =
    totalVotes > 0
      ? mealOptions.reduce(
          (leadingMeal, meal) => {
            if (
              getVoteCount(meal.id) >
              getVoteCount(
                leadingMeal.id
              )
            ) {
              return meal;
            }

            return leadingMeal;
          },
          mealOptions[0]
        )
      : null;

  // =====================================================
  // COUNTDOWN FORMAT
  // =====================================================

  const safeTimeLeft =
    timeLeft ?? 0;

  const hours = Math.floor(
    safeTimeLeft / 3600
  );

  const minutes = Math.floor(
    (safeTimeLeft % 3600) / 60
  );

  const seconds =
    safeTimeLeft % 60;

  const formattedHours =
    String(hours).padStart(
      2,
      "0"
    );

  const formattedMinutes =
    String(minutes).padStart(
      2,
      "0"
    );

  const formattedSeconds =
    String(seconds).padStart(
      2,
      "0"
    );

  const votingClosed =
    votingLoaded &&
    timeLeft === 0;

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-10 sm:px-6 lg:px-8">

      <div className="mx-auto w-full max-w-3xl">

        {/* HEADER */}

        <div className="mb-8 text-center">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-3xl shadow-lg shadow-indigo-200">
            🗳️
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Special Meal Voting
          </h1>

          <p className="mt-3 text-base text-gray-500 sm:text-lg">
            Choose the special meal you want to see
          </p>

        </div>

        {/* COUNTDOWN */}

        <div
          className={`mb-6 rounded-3xl border p-6 text-center shadow-md ${
            votingClosed
              ? "border-red-200 bg-red-50"
              : "border-indigo-100 bg-white"
          }`}
        >

          <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">

            {!votingLoaded
              ? "Loading Voting..."
              : votingClosed
              ? "Voting Closed"
              : "⏳ Voting Ends In"}

          </p>

          {!votingLoaded ? (

            <div className="mt-4">

              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />

              <p className="mt-3 text-sm text-gray-500">
                Loading voting deadline...
              </p>

            </div>

          ) : !votingClosed ? (

            <div className="mt-3 flex items-center justify-center gap-3">

              <div className="rounded-xl bg-indigo-50 px-4 py-3">
                <p className="text-2xl font-bold text-indigo-600 sm:text-3xl">
                  {formattedHours}
                </p>

                <p className="text-xs text-gray-500">
                  Hours
                </p>
              </div>

              <span className="text-2xl font-bold text-gray-400">
                :
              </span>

              <div className="rounded-xl bg-purple-50 px-4 py-3">
                <p className="text-2xl font-bold text-purple-600 sm:text-3xl">
                  {formattedMinutes}
                </p>

                <p className="text-xs text-gray-500">
                  Minutes
                </p>
              </div>

              <span className="text-2xl font-bold text-gray-400">
                :
              </span>

              <div className="rounded-xl bg-pink-50 px-4 py-3">
                <p className="text-2xl font-bold text-pink-600 sm:text-3xl">
                  {formattedSeconds}
                </p>

                <p className="text-xs text-gray-500">
                  Seconds
                </p>
              </div>

            </div>

          ) : (

            <div>

              <p className="mt-3 text-xl font-bold text-red-600">
                🔒 Voting has ended
              </p>

              <p className="mt-1 text-sm text-red-500">
                Thank you for participating!
              </p>

            </div>

          )}

        </div>

        {/* TRENDING MEAL */}

        {trendingMeal && (
          <div className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 p-[1px] shadow-lg">

            <div className="rounded-[23px] bg-white p-6">

              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">

                <div className="flex items-center gap-4">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-3xl">
                    🔥
                  </div>

                  <div>

                    <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
                      Trending Meal
                    </p>

                    <h2 className="mt-1 text-xl font-extrabold text-gray-900">
                      {trendingMeal.emoji}{" "}
                      {trendingMeal.name}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Currently leading the vote
                    </p>

                  </div>

                </div>

                <div className="rounded-2xl bg-orange-50 px-5 py-3 text-center">

                  <p className="text-2xl font-extrabold text-orange-600">
                    {getVoteCount(
                      trendingMeal.id
                    )}
                  </p>

                  <p className="text-xs font-medium text-orange-500">
                    Votes
                  </p>

                </div>

              </div>

            </div>

          </div>
        )}

        {/* VOTING CARD */}

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/60 sm:p-8">

          <div className="mb-6">

            <h2 className="text-xl font-bold text-gray-900">
              What should we serve?
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Select one option and cast your vote.
            </p>

          </div>

          {/* MEALS */}

          <div className="grid gap-4 sm:grid-cols-2">

            {mealOptions.map(
              (meal) => {

                const voteCount =
                  getVoteCount(
                    meal.id
                  );

                const isSelected =
                  selectedMeal ===
                  meal.id;

                return (
                  <button
                    key={meal.id}
                    type="button"
                    disabled={
                      votingClosed ||
                      !votingLoaded
                    }
                    onClick={() =>
                      setSelectedMeal(
                        meal.id
                      )
                    }
                    className={`relative rounded-2xl border-2 p-5 text-left transition-all duration-200 ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-100"
                        : "border-gray-100 bg-gray-50 hover:-translate-y-1 hover:border-indigo-200 hover:bg-white hover:shadow-md"
                    } ${
                      votingClosed ||
                      !votingLoaded
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    }`}
                  >

                    {isSelected && (
                      <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white">
                        ✓
                      </div>
                    )}

                    <div className="flex items-center gap-4">

                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
                        {meal.emoji}
                      </div>

                      <div>

                        <h3 className="font-bold text-gray-900">
                          {meal.name}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {voteCount}{" "}
                          {voteCount === 1
                            ? "vote"
                            : "votes"}
                        </p>

                      </div>

                    </div>

                  </button>
                );
              }
            )}

          </div>

          {/* ERROR */}

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              ⚠️ {error}
            </div>
          )}

          {/* VOTE BUTTON */}

          <button
            type="button"
            onClick={handleVote}
            disabled={
              loading ||
              !selectedMeal ||
              votingClosed ||
              !votingLoaded
            }
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          >

            {!votingLoaded
              ? "Loading..."
              : votingClosed
              ? "Voting Closed"
              : loading
              ? "Submitting..."
              : "Cast My Vote"}

            {!loading &&
              !votingClosed &&
              votingLoaded && (
                <span className="text-xl">
                  →
                </span>
              )}

          </button>

        </div>

        {/* WINNER */}

        {winners.length > 0 && (
          <div className="mt-8 rounded-3xl border border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 p-6 text-center shadow-md">

            <div className="text-4xl">
              {isTie ? "🤝" : "👑"}
            </div>

            <h2 className="mt-2 text-xl font-bold text-gray-900">
              {isTie
                ? "It's a Tie!"
                : "Current Winner"}
            </h2>

            <div className="mt-4 flex flex-wrap justify-center gap-3">

              {winners.map(
                (meal) => (
                  <div
                    key={meal.id}
                    className="rounded-2xl bg-white px-5 py-3 shadow-sm"
                  >

                    <span className="text-2xl">
                      {meal.emoji}
                    </span>

                    <span className="ml-2 font-bold text-gray-900">
                      {meal.name}
                    </span>

                    <span className="ml-2 text-sm font-semibold text-indigo-600">
                      {highestVoteCount} votes
                    </span>

                  </div>
                )
              )}

            </div>

          </div>
        )}

        {/* LIVE RESULTS */}

        <div className="mt-10">

          <div className="mb-5">

            <h2 className="text-2xl font-bold text-gray-900">
              Live Results
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Votes update automatically in real time.
            </p>

          </div>

          <div className="space-y-4">

            {mealOptions.map(
              (meal) => {

                const voteCount =
                  getVoteCount(
                    meal.id
                  );

                const percentage =
                  totalVotes > 0
                    ? Math.round(
                        (voteCount /
                          totalVotes) *
                          100
                      )
                    : 0;

                const isWinner =
                  highestVoteCount >
                    0 &&
                  voteCount ===
                    highestVoteCount;

                return (
                  <div
                    key={meal.id}
                    className={`rounded-2xl border bg-white p-5 shadow-md ${
                      isWinner
                        ? "border-indigo-300 ring-2 ring-indigo-100"
                        : "border-gray-100"
                    }`}
                  >

                    <div className="flex items-center justify-between">

                      <div className="flex items-center gap-3">

                        <span className="text-2xl">
                          {meal.emoji}
                        </span>

                        <div className="flex items-center gap-2">

                          <span className="font-semibold text-gray-900">
                            {meal.name}
                          </span>

                          {isWinner && (
                            <span className="rounded-full bg-indigo-50 px-2 py-1 text-xs font-bold text-indigo-600">
                              👑 Leading
                            </span>
                          )}

                        </div>

                      </div>

                      <span className="text-sm font-bold text-indigo-600">
                        {voteCount} votes
                      </span>

                    </div>

                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-100">

                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />

                    </div>

                    <p className="mt-2 text-right text-xs font-medium text-gray-400">
                      {percentage}%
                    </p>

                  </div>
                );
              }
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

export default Voting;