const sgMail = require('@sendgrid/mail')

const emailSender = async (msg) => {
    // testing sendGRID
    sgMail.setApiKey('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')
    
    try {
        await sgMail.send(msg)
    } catch (error) {
        console.error(error);

        if (error.response) {
            console.error(error.response.body)
        }
    }
}

module.exports = emailSender
