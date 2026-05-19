import { canAccessPayments } from '../utils/orderScope.js';

export function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user?.role) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }
    next();
  };
}

export function requirePaymentAccess(req, res, next) {
  if (!req.user?.role || !canAccessPayments(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Payment access denied' });
  }
  next();
}
