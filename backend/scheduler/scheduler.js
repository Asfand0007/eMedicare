const pool = require('../db');
const schedule = require('node-schedule');

const initializeResetScheduler = () => {
    //minute hours
    schedule.scheduleJob('0 0 * * *', async () => {
        console.log("Resetting administered status...");

        try {
            await pool.query('SELECT reset_administered_status();');
            console.log("Administered status reset successfully at 00:00.");
        } catch (err) {
            console.error("Error resetting administered status:", err.message);
        }
    });

    console.log("Scheduler initialized. The reset function will run at 00:00 daily.");
};

module.exports = initializeResetScheduler;
