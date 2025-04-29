const UserResponse = require("../models/UserResponse");


exports.getUserResponse = async (req, res) => {
    try{
        const userresponse = await UserResponse.find();
        res.json(userresponse);
    } catch (error){
        res.status(500).json({message: error.message});
    }
}

exports.getUserResponses2 = async (req, res) => {
    try {
        const responses = await UserResponse.find()
            .populate("user", "name email -_id")  
            .populate("quiz", "title -_id")       
            .populate("responses.question", "question correct_answer -_id") 
            .select('-_id responses totalScore completedAt status'); 

        res.json(responses); 
    } catch (error) {
        console.error("Error fetching user responses:", error);
        res.status(500).json({ error: "Server Error" }); 
    }
};


  

exports.userResponseByuser = async (req, res) =>{
    try{
        const { id } = req.params;
        const userresponse = await UserResponse.find({user: id})
        .populate({
            path: 'quiz',  
            select: 'title _id',  
            populate: [
                {
                    path: 'category',  
                    select: 'name image -_id' 
                },
                {
                    path: 'difficulty',  
                    select: 'name -_id' 
                }
            ]
        },)
        .populate("responses.question", "question  -_id");

        if (!userresponse || userresponse.length === 0) {
            return res.status(404).json({ message: "No user response found" });
        }
         
        return res.status(200).json(userresponse);
    } catch (error){
        res.status(500).json({message: error.message});
    }
}

exports.createUserResponse = async (req, res) => {
   // console.log("Incoming request body:", req.body); 

    const { user, quiz, responses, totalScore } = req.body;
  
    try {
        // First, check if there's an existing response for this user and quiz
        await UserResponse.findOneAndDelete({ user, quiz });

        // Create new response
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
