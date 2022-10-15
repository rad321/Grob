import { StatusCodes } from "http-status-codes"
import { exceptionMsg, successMsg } from "../constants/constants"
import { findUser, updateUserCredits } from "../database/queries"
import { Utils } from "../utils/utils"
/**
 * 
 * @param req 
 * @param res 
 */
export const updateCredits = async (req, res) => {
    let user = await findUser(req.body.email)
    updateUserCredits(req.body.credits, user[0].dataValues.id)
        .then(() => res.status(StatusCodes.OK).json(Utils.getReasonPhrase(StatusCodes.OK, successMsg.UPDATE_CREDITS)))
        .catch((err) => res.status(StatusCodes.BAD_REQUEST).json(Utils.getReasonPhrase(StatusCodes.BAD_REQUEST, exceptionMsg.ERR_UPDATE_CREDITS + err)))

}
