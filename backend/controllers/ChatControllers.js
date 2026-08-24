import { chatWithGemini } from "../config/gemini.js";
import Thread from "../models/Thread.js";

export const chat=async(req,res)=>{
    
        const {threadId,message}=req.body;
        if(!threadId || !message) return res.status(400).json({error:"missing required fields"});
        try{
       let thread=await Thread.findOne({threadId});
       if(!thread)
       {
        thread=new Thread(
            {
                threadId,
                title:message,
                messages:[{role:"user",content:message}]
            }
        )
       }else
       {
        thread.messages.push({role:"user",content:message})
       }


       const assistantReply= await chatWithGemini(message);

       thread.messages.push({role:"assistant",content:assistantReply});
     
       await thread.save();
       res.json({reply:assistantReply});

    }catch(err){
        res.status(500).json({error: err.message});
    }
}

export const thread=async(req,res)=>{
    try{

        const threads=await Thread.find({}).sort({updatedAt:-1});
        res.json(threads)

    }catch(err){
        return res.status(500).json({error:err.message});
    }
};

export const threadId=async(req,res)=>{
    const {threadId}=req.params;
    try{
        
        const threadDetails=await Thread.findOne({threadId});
        if(!threadDetails)
        {
          res.status(400).json({error:"Thread not found"});
        }
        res.json(threadDetails.messages);
    }catch(e){
       return res.status(500).json({error:e.message})
    }
};

export const Delete = async(req,res)=>{
    const {threadId}=req.params;
     try{
       const deletedThread=await Thread.findOneAndDelete({threadId});

       if(!deletedThread){
        res.status(404).json({error:"Thread could not found"});
       }
       res.status(200).json({success:"Thread deleted successfully"});
     }catch(e){
        return res.status(500).json({error:e.message});
     }
}