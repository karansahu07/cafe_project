import { Navigate } from 'react-router-dom';
import { getResolvedRoleId } from '../utils/authSession';

export default function RoleBasedDashboard({ children }) {
  const roleId = getResolvedRoleId();

  if (Number(roleId) === 3) {
    return <Navigate to="/new-home" replace />;
  }

  return children;
}
