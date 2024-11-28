const pool = require('../../db');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;
const getAiRecommendation = async (req, res) => {
    const { mrID } = req.body;
    let diagnosis;

    try {
        const patientDiagnosis = await pool.query(
            `SELECT P.diagnosis
             FROM patients P
             WHERE P.mrID=$1`,
            [mrID]
        );

        diagnosis = patientDiagnosis.rows[0]?.diagnosis;

        if (!diagnosis) {
            return res.status(404).json({ msg: "Diagnosis not found for the given MRID" });
        }
    } catch (error) {
        console.error("Server error: ", error.message);
        return res.status(500).json({ msg: "Server error" });
    }

    const prompt = `
    I have a patient diagnosed with ${diagnosis}. Can you provide a guide on how to care for them? Keep this in mind that these instructions are for the nurses on how best to take care of the patient. Please include the following:
        The best practices for daily care, including physical and emotional support. Give your answer in 200 words max!!!
        Lifestyle adjustments and dietary recommendations, if applicable.
        Possible symptoms or complications to monitor.
        Tips for communicating effectively with the patient and their healthcare providers.
        Any relevant precautions or considerations based on their specific condition.
        Return the response in a single string with no brackets, quotes, bullet points, or numbering. The output should be in paragraph format, comprehensive, and include all the requested details.
    `;

    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        // console.log(result.response.text());
        return res.status(201).json({ response: result.response.text() });

    } catch (error) {
        console.error("AI Generation error: ", error); // Log the entire error object for more context
        return res.status(500).json({ msg: "Error generating AI response", error: error.message });
    }
};


module.exports = {
    getAiRecommendation,
};
