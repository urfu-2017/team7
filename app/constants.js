const HOSTNAME = process.env.HOSTNAME;
const PORT = parseInt(process.env.PORT, 10) || 3000;

module.exports = {
    HOSTNAME,
    PORT,
    HOST: `${HOSTNAME}:${PORT}`
};
