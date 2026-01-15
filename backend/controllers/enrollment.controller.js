export const enrollCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Later we will save this in DB
        res.status(200).json({
            success: true,
            message: "Enrollment successful",
            courseId,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
