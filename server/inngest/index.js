import { Inngest } from "inngest";
import User from "../models/user.js";

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
            let username = username + Math.floor(Math.random() * 10000);
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

// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion
];