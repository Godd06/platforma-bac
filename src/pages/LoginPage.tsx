import React from 'react'
import { AuthShell } from '@/components/auth/AuthShell'

export const LoginPage: React.FC = () => {
  return <AuthShell initialMode="login" />
}

export default LoginPage
