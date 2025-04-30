import { Support } from './../models/support.model.js';
import { User } from './../models/user.model.js';
import asyncHandler from './../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
let queryTypes = {
    'help': 'lorem ipsum for help',
    'system': 'lorem ipsum for system',
    'complain': 'lorem ipsum for complain',
    'feedback': 'lorem ipsum for system feedback'
};
const postAppSupportQuestion = asyncHandler( async (req, res) => {
    const { query, queryType } = req.body;
    let newSupportQuery = await Support.create({
        askedBy: req.user._id,
        query,
        queryType,
        queryTypeDescription: queryTypes.queryType
    });
    if ( !newSupportQuery ) {
        throw new ApiError(500, "Internal Server Error.");
    };
    return res.status(201).json(
        new ApiResponse(201, newSupportQuery, "Successfully added support query.")
    );
});

// add checkAdmin middleware in the router of following controller alongwith verifyJWT.
const patchAnswerSupportQuestion = asyncHandler( async (req, res) => {
    const { reply, queryId } = req.body;
    let support = await Support.findById(queryId);
    support.reply = reply;
    support.answeredBy = req.user._id;
    await support.save();
    let updatedSupport = await Support.findByIdAndUpdate(
        queryId,
        {
            $set: {
                reply,
                answeredBy:{
                    id: req.user._id,
                    name: req.user.fullName
                },
                status: 'answered',
                answeredAt: new Date()
            }
        }, {
            new: true
        }
    );
    if ( !updatedSupport ) {
        throw new ApiError(500, "Internal Server Error, Something went wrong when adding reply.")
    };
    return res.status(201).json(
        new ApiResponse(201, updatedSupport, "Successfuly added reply.")
    );
});
// add a getAdminInfo controller in User.controller.js

const getQueriesOfUser = asyncHandler( async(req, res) => {
    let allQueries = await Support.find({askedBy: req.user._id});
    res.status(200).json(
        new ApiResponse(
            200,
            allQueries,
            (allQueries) ? "Successfully fetched queries" : "No queries for user found."
        )
    );
});

// add Delete query if required.

export {
    postAppSupportQuestion,
    patchAnswerSupportQuestion,
    getQueriesOfUser
}