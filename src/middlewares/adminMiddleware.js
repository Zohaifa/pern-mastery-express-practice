export const adminMiddleware = (req, res, next) => {
    if(req.user.role !== 'ADMIN'){
        return res.status(403).json({ status: 'failed', message: 'Access denied. Admins only.' });
    }
    next();
}