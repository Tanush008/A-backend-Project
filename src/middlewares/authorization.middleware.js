import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import jwt from "jsonwebtoken"
export const verifyjwt = asyncHandler((req,_,next)=>{
   try {
    const token =  req.cookies?. accessToken || req.header( 'Authorization' )?.replace( 'Bearer ', '' );
     if(!token){
         throw new ApiErrors(401,"Unautorized access")
     }
     const decodeToken=jwt.verify(token,process.env.ACCESS_TOKEN)
      const user = awaitUser.findById(decodeToken?.id).select( '-password' -'refreshToken')
     if(!user){
         throw new ApiErrors(401,"Unautorized access")
     }
     req.user=user;
     next();
   } catch (error) {
    throw new ApiErrors(error?.message||"Unautorized access",401)
   }

})