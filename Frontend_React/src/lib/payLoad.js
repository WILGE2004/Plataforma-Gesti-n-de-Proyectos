import jwt from 'jsonwebtoken';

const returnToken = () => {
    const token = localStorage.getItem('token');
    if (token !== null) {
        const payload = jwt.verify(token, process.env.REACT_APP_SECRET_KEY);
        return payload;
    } else {
        return null
    };
};

export { returnToken };