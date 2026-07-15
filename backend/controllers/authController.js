import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ==========================================
   FORMAT USER RESPONSE
========================================== */

const userResponse = (user) => {
  return {
    _id: user._id,
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};


/* ==========================================
   GENERATE JWT TOKEN
========================================== */

const generateToken = (userId) => {

  if (!process.env.JWT_SECRET) {
    throw new Error(
      "JWT_SECRET is missing in environment variables"
    );
  }

  return jwt.sign(
    {
      id: userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};


/* ==========================================
   REGISTER USER
========================================== */

export const register = async (req, res) => {
  try {

    let {
      name,
      email,
      password,
      role = "Team Member",
    } = req.body;


    name = name?.trim();
    email = email?.trim().toLowerCase();


    if (!name || !email || !password) {
      return res.status(400).json({
        success:false,
        message:
          "Name, email and password are required",
      });
    }


    if (password.length < 6) {
      return res.status(400).json({
        success:false,
        message:
          "Password must contain at least 6 characters",
      });
    }


    const existingUser =
      await User.findOne({ email });


    if (existingUser) {
      return res.status(400).json({
        success:false,
        message:
          "Email already registered",
      });
    }


    const hashedPassword =
      await bcrypt.hash(password, 10);


    const user =
      await User.create({
        name,
        email,
        password: hashedPassword,
        role,
      });


    const token =
      generateToken(user._id);


    return res.status(201).json({
      success:true,
      message:
        "Registration successful",
      token,
      user:userResponse(user),
    });


  } catch(error){

    console.error(
      "Register Error:",
      error
    );


    return res.status(500).json({
      success:false,
      message:
        error.message ||
        "Server error",
    });
  }
};



/* ==========================================
   LOGIN USER
========================================== */

export const login = async (req,res)=>{

  try{

    let {
      email,
      password
    } = req.body;


    email =
      email?.trim().toLowerCase();


    if(!email || !password){

      return res.status(400).json({
        success:false,
        message:
          "Email and password are required",
      });
    }


    const user =
      await User.findOne({
        email
      });


    if(!user){

      return res.status(401).json({
        success:false,
        message:
          "Invalid email or password",
      });
    }


    const matched =
      await bcrypt.compare(
        password,
        user.password
      );


    if(!matched){

      return res.status(401).json({
        success:false,
        message:
          "Invalid email or password",
      });
    }


    const token =
      generateToken(user._id);


    return res.status(200).json({

      success:true,

      message:
        "Login successful",

      token,

      user:userResponse(user),

    });


  }catch(error){

    console.error(
      "Login Error:",
      error
    );


    return res.status(500).json({

      success:false,

      message:
        error.message ||
        "Server error",

    });
  }

};



/* ==========================================
   GET CURRENT USER
========================================== */

export const getMe = async(req,res)=>{

  try{


    if(!req.user){

      return res.status(401).json({

        success:false,

        message:
          "Not authorized",

      });
    }


    const user =
      await User.findById(
        req.user._id
      )
      .select("-password");


    if(!user){

      return res.status(404).json({

        success:false,

        message:
          "User not found",

      });
    }


    return res.status(200).json({

      success:true,

      user,

    });



  }catch(error){


    console.error(
      "GetMe Error:",
      error
    );


    return res.status(500).json({

      success:false,

      message:
        "Server error",

    });

  }

};

