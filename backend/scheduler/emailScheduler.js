const schedule = require('node-schedule');
const nodemailer = require('nodemailer');
const pool = require('../db');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
    },
});

const sendEmail = async (email, subject, message) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject,
        text: message,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${email}`);
    } catch (error) {
        console.error(`Error sending email to ${email}:`, error.message);
    }
};

const initializeEmailScheduler = async () => {
    try {
        const dosageQuery = await pool.query(`
            SELECT 
                pt.mrID,
                pt.firstName || ' ' || pt.lastName AS patientName,
                pt.roomNumber,
                d.dosageID,
                d.dosage_amount,
                d.formulaName,
                dt.Time
            FROM 
                Patients pt
            JOIN 
                dosage d ON pt.mrID = d.patientmrID
            JOIN 
                dosageTimes dt ON dt.dosageID = d.dosageID
            WHERE 
                administered = false
            ORDER BY 
                CASE 
                    WHEN dt.Time >= (CURRENT_TIME + INTERVAL '5 hours 2 minutes') THEN 0
                    ELSE 1
                END,
                dt.Time ASC;
        `);

        if (dosageQuery.rows.length === 0) {
            console.log('No upcoming dosage. Checking again in 30 minutes...');
            schedule.scheduleJob(new Date(Date.now() + 30 * 60 * 1000), async () => {
                console.log('Rechecking for upcoming dosages...');
                await initializeEmailScheduler();
            });
            return;
        }

        const row = dosageQuery.rows[0];
        const dosageTime = new Date();
        const [hours, minutes] = row.time.split(':');
        dosageTime.setHours(parseInt(hours, 10));
        dosageTime.setMinutes(parseInt(minutes, 10) - 2);
        dosageTime.setSeconds(0);
        console.log(`${dosageTime}`);
        if (dosageTime > new Date()) {
            schedule.scheduleJob(dosageTime, async () => {
                const email = `k224626@nu.edu.pk`; 
                const subject = `Dosage Reminder for ${row.patientname}`;
                const message = `Reminder for patient ${row.patientname} (Room ${row.roomnumber}):
                Dosage of ${row.dosage_amount} ${row.formulaname} is scheduled for ${row.time}.
                    `;

                await sendEmail(email, subject, message);

                console.log(`Email sent. Scheduling next email`);
                await initializeEmailScheduler();
            });
            console.log(`Scheduled email for patient ${row.patientname} at ${dosageTime}`);
        }
    } catch (error) {
        console.error('Error initializing scheduler:', error.message);
    }
};

module.exports = initializeEmailScheduler;