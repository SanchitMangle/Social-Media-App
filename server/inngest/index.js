import { Inngest } from "inngest";
import User from "../models/user.js";
import sendMail from "../config/nodeMailler.js";
import Connection from "../models/connection.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "pingup-app" });

// Inngest function to save user data to database
const syncUserCreation = inngest.createFunction(

    { id: "sync-user-from-clerk" },
    { event: "clerk/user.created" },

    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        let username = email_addresses[0].email_address.split("@")[0];

        //   check availability of username
        const user = await User.findOne({ username });
        if (user) {
            username = username + Math.floor(Math.random() * 10000);
        }

        const userData = {
            _id: id,
            full_name: first_name + " " + last_name,
            username: username,
            email: email_addresses[0].email_address,
            profile_picture: image_url,
        }

        await User.create(userData);

    }

)

// Inngest function to update user data to database

const syncUserUpdation = inngest.createFunction(

    { id: "update-user-from-clerk" },
    { event: "clerk/user.updated" },

    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        let username = email_addresses[0].email_address.split("@")[0];

        const updateUserData = {
            email: email_addresses[0].email_address,
            profile_picture: image_url,
            full_name: first_name + " " + last_name,
        }

        await User.findByIdAndUpdate(id, updateUserData);

    }

)

// Inngest function to delete user data to database

const syncUserDeletion = inngest.createFunction(

    { id: "delete-user-with-clerk" },
    { event: "clerk/user.deleted" },

    async ({ event }) => {
        const { id } = event.data;

        const updateUserData = {
            isActive: false,
        }

        await User.findByIdAndUpdate(id, updateUserData);

    }

)

// Inngest function to send email when new user requests added 
const sendEmailWhenNewUserRequestsAdded = inngest.createFunction(

    { id: "send-new-connection-request-reminder" },
    { event: "app/connection-request" },

    async ({ event, step }) => {
        const { connctionID } = event.data
        await step.run('send-connection-request-mail', async () => {
            const connection = await Connection.findById(connctionID).populate('from_user_id to_user_id')
            const subject = `New Connection Request from ${connection.from_user_id.full_name}`
            const body = `<div style="font-family: Arial, sans-serif;padding: 20px">
            <h2>Hi ${connection.to_user_id.full_name},</h2>
            <P>You have new connection request from ${connection.from_user_id.full_name}- @${connection.from_user_id.username}</P>
            <p>Click <a href="${process.env.FRONTEND_URL}/connection" style="color: #10b981;">here</a> to accept or reject the request</p>
            <br/>
            <p>Thanks <br/> PingUp- Stay Connected</p>
            </div>`

            await sendMail({
                to: connection.to_user_id.email,
                subject,
                body
            })
        })

        const in24HourInterval = new Date(Date.now() + 24 * 60 * 60 * 1000)

        await step.sleepUntil('wait-for-24-hours', in24HourInterval)
        await step.run('send-connection-request-reminder', async () => {
            const connection = await Connection.findById(connctionID).populate('from_user_id to_user_id')

            if (connection.status = 'accepted') {
                return { message: 'Connection request already accepted' }
            }
            const subject = `New Connection Request from ${connection.from_user_id.full_name}`
            const body = `<div style="font-family: Arial, sans-serif;padding: 20px">
            <h2>Hi ${connection.to_user_id.full_name},</h2>
            <P>You have new connection request from ${connection.from_user_id.full_name}- @${connection.from_user_id.username}</P>
            <p>Click <a href="${process.env.FRONTEND_URL}/connection" style="color: #10b981;">here</a> to accept or reject the request</p>
            <br/>
            <p>Thanks <br/> PingUp- Stay Connected</p>
            </div>`

            await sendMail({
                to: connection.to_user_id.email,
                subject,
                body
            })
        })

        return { message: 'Connection request reminder sent successfully' }
    }
)

// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion,
    sendEmailWhenNewUserRequestsAdded
];