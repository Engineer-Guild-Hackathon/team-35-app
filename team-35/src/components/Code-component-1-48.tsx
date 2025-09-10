import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Screen } from '../types';
import { 
  Home, 
  BookOpen, 
  Music, 
  Plus, 
  Settings, 
  User,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

interface NavigationProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  user: { name: string; email: string };
}

export const Navigation = ({ currentScreen, onNavigate, user }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard' as Screen, label: 'ホーム', icon: Home },
    { id: 'words' as Screen, label: '単語管理', icon: BookOpen },
    { id: 'songs' as Screen, label: '楽曲', icon: Music },
    { id: 'add-word' as Screen, label: '単語追加', icon: Plus },
    { id: 'settings' as Screen, label: '設定', icon: Settings },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-600 rounded-lg p-2">
              <Music className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold">ミミコーチ</h1>
              <p className="text-sm text-gray-600">音楽で覚える英単語</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentScreen === item.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => {
                      onNavigate(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
            
            {/* User Info in Mobile */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-200 rounded-full p-2">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">{user.name}</p>
                  <p className="text-xs text-gray-600">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-gray-200">
        <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-4 mb-8">
            <div className="bg-purple-600 rounded-lg p-3">
              <Music className="h-8 w-8 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-900">ミミコーチ</h1>
              <p className="text-sm text-gray-600">音楽で覚える英単語</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    isActive 
                      ? 'bg-purple-600 text-white hover:bg-purple-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => onNavigate(item.id)}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                  {item.id === 'add-word' && (
                    <Badge variant="secondary" className="ml-auto">
                      新規
                    </Badge>
                  )}
                </Button>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="flex-shrink-0 p-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center">
                <div className="bg-purple-600 rounded-full p-2">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="grid grid-cols-5 py-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`flex flex-col items-center py-2 px-1 h-auto ${
                  isActive ? 'text-purple-600' : 'text-gray-600'
                }`}
                onClick={() => onNavigate(item.id)}
              >
                <Icon className={`h-5 w-5 mb-1 ${isActive ? 'text-purple-600' : ''}`} />
                <span className={`text-xs ${isActive ? 'text-purple-600 font-medium' : ''}`}>
                  {item.label}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </>
  );
};