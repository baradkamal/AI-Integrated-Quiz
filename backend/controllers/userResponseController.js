const UserResponse = require("../models/UserResponse");


exports.getUserResponse = async (req, res) => {
    try{
        
        const userresponse = await UserResponse.find();
        res.json(userresponse);
    } catch (error){
        res.status(500).json({message: error.message});
    }
}

exports.createUserResponse = async (req, res) => {
    console.log("Incoming request body:", req.body); // Log the incoming request body

    const { user, quiz, responses, totalScore } = req.body;
  
    try {
        const userResponse = await UserResponse.create({ 
            user, 
            quiz, 
            responses, 
            totalScore,
            completedAt: new Date(),
            status: 'completed'
        });

        if (userResponse) {
            res.status(201).json({
                _id: userResponse._id,
                user: userResponse.user,
                quiz: userResponse.quiz,
                totalScore: userResponse.totalScore,
                status: userResponse.status
            });
        } else {
            res.status(400).json({ message: "Invalid user response data" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
