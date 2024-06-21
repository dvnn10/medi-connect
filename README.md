# Setting up MongoDB for MediConnectSeva

In this guide, we'll walk you through the process of setting up MongoDB for your MediConnectSeva application.

## Environment Variable Setup

Create a file named `.env` in the root directory of your project and add the following line to it:

```dotenv
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-uri>/<default-database>?retryWrites=true&w=majority
