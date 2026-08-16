function AnnouncementForm({
  title,
  message,
  setTitle,
  setMessage,
  onSubmit,
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-8">

      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Create Announcement
      </h2>

      <form
        onSubmit={onSubmit}
        className="space-y-4"
      >

        {/* Title */}

        <input
          type="text"
          placeholder="Announcement title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        />


        {/* Message */}

        <textarea
          placeholder="Announcement message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="4"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        />


        {/* Submit */}

        <button
          type="submit"
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
        >
          Add Announcement
        </button>

      </form>

    </div>
  );
}

export default AnnouncementForm;