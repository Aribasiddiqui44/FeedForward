import mongoose, {Schema} from "mongoose";
import { Rider } from "./rider.model";

const donationSchema = new Schema ({
    donationFoodTitle: {
        type: String,

    },
    donationFoodList: [
        {
            foodItemName: {
                type: String
            },
            foodItemDescription: {
                type: String // if any
            },
            foodItemQuantity: {
                quantity: {type: float},
                unitOfMeasurement: {
                    type: String,
                    default: "kg"
                }
            },
            donatedTo: {
                // reference to receiver organization if there are different receivers for different food items of a donation.
                receiverId: {
                    
                },
                receiverOrgName: {
                    type: String
                },
                receiverOrgEmail: {
                    type: String
                },
                receivedOn: {
                    type: Date
                }
            },
            riderInformation: {
                riderId: {
                    type: Schema.Types.ObjectId,
                    ref: Rider                    
                },
                riderName: {type: String},
                riderPhone: {type: String}
            }

        }
    ],
    donationDescription: {
        type: String
    },
    donationUnitPrice: {
        value: {type: float},
        currency: {type: String}
    },
    donationQuantity: {
        quantity: {type: float},
        measurementUnit: {
            type: String,
            default: "kg"
        }
    },
    doantionInitialPickupTimeRange: {
        startingTime: {type: String},
        endingTime: {type: String}
    },
    donationPickupInstructions: [
        {
            type: String
        }
    ],
    goodnessOfFood: {
        bestBefore:{
            // date time reference
            //https://www.mongodb.com/docs/manual/reference/method/Date/
            //Date() returns the current date as a string in mongo shell. new Date() returns the current date as a Date object. mongo shell wraps the Date object with the ISODate helper. The ISODate is in UTC.
            // new Date("<YYYY-mm-ddTHH:MM:ssZ>") specifies the datetime in UTC and returns the ISODate with the specified datetime in UTC. new Date(<integer>) specifies the datetime as milliseconds since the UNIX epoch (Jan 1, 1970), and returns the resulting ISODate instance.
            type: Date,
            default: Date.now
        },
        listedFor: {
            period: {type: float},
            timeUnit: {type: String} // days, hours, etc
        }
    },
    rider: {
        //complete after creating rider model., a rider is associated with the donation
        riderId: {

        },
        riderName:{
            type: String
        },
        riderPhone: {
            type: String
        }
    },
    isDonationCompletedSuccessfully: {
        isCompleted: {type: Boolean, default: false},
        comments: {type: String //in case of any problems.
        }
    }
},
{
    timestamps: true
}
);

export const Donation = mongoose.model("Donation", donationSchema);
