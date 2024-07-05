## live link-https://mediconnect-9hzp.onrender.com/ 
# Admin portal demo
https://github.com/Arshitsharma/MediConnect/assets/92247108/ff0a0a8a-17d1-462c-9ec2-9eeb984e8435   

# Setting up MongoDB for MediConnectSeva

In this guide, we'll walk you through the process of setting up MongoDB for your MediConnectSeva application.

## Environment Variable Setup

1. **Create a `.env` File:**
   - Create a file named `.env` in the root directory of your project.

2. **Add MongoDB URI:**
   - Add the following line to your `.env` file, replacing `<username>`, `<password>`, `<cluster-uri>`, and `<default-database>` with your MongoDB credentials and database details:

     ```dotenv
     MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-uri>/<default-database>?retryWrites=true&w=majority
     ```

     Example:
     ```dotenv
     MONGODB_URI=mongodb+srv://Arshit:xyz@cluster0.xyzabc.mongodb.net/mediconnect?retryWrites=true&w=majority
     ```

## Installing Dependencies

Before proceeding, ensure you have Node.js and npm installed on your system.

1. **Install Node.js and npm:**
   - If Node.js and npm are not installed, download and install them from [nodejs.org](https://nodejs.org/).

2. **Install Project Dependencies:**
   - Open your terminal and navigate to the root directory of your project.
   - Run the following command to install dependencies:

     ```bash
     npm install
     ```

## Running the Application

Once MongoDB URI is configured and dependencies are installed, you can start the MediConnectSeva application.

1. **Start the Application:**
   - Run the following command in your terminal:

     ```bash
     npm start
     ```

2. **Access the Application:**
   - Open your web browser and go to `http://localhost:5000` to use the MediConnectSeva application.

## Summary

By following these steps, you've successfully set up MongoDB for your MediConnectSeva application. The `.env` file securely manages your MongoDB URI, and running `npm install` installs necessary dependencies while `npm start` launches your application on port 5000.

If you encounter any issues or have further questions, feel free to reach out!

