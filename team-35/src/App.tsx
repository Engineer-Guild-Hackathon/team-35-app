import { useState } from "react";
import "./index.css";
import "./style/globals.css";
import { useAuth } from "./hooks/useAuth";
import { Screen } from "./types";

// Components
import { LoginScreen } from "./components/LoginScreen";
import { Dashboard } from "./components/Dashboard";
import { WordsScreen } from "./components/WordsScreen";
import { AddWordScreen } from "./components/AddWordScreen";
import { SongsScreen } from "./components/SongsScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import { Navigation } from "./components/Navigation";

export default function App() {
  const { user, loading, login, register, logout } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>("dashboard");

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">ミミコーチを起動中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onLogin={login} onRegister={register} />;
  }

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case "dashboard":
        return <Dashboard user={user} />;
      case "words":
        return (
          <WordsScreen
            onNavigate={(screen: string) => setCurrentScreen(screen as Screen)}
          />
        );
      case "add-word":
        return (
          <AddWordScreen
            onNavigate={(screen: string) => setCurrentScreen(screen as Screen)}
          />
        );
      case "songs":
        return (
          <SongsScreen
            onNavigate={(screen: string) => setCurrentScreen(screen as Screen)}
          />
        );
      case "settings":
        return <SettingsScreen user={user} onLogout={logout} />;
      default:
        return <Dashboard user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        user={user}
      />

      {/* Main Content */}
      <div className="lg:pl-64">
        <main className="pb-20 lg:pb-0">{renderCurrentScreen()}</main>
      </div>
    </div>
  );
}
