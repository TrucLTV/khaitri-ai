import { AuthProvider } from './context/AuthContext'
import Router from './core/Router'

export default function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  )
}
