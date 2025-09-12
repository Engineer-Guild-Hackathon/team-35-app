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
  X,
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

  const toggleMobileMenu = () => setIsMobileMenuOpen((v) => !v);

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-sidebar border-b border-sidebar-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary rounded-lg p-2">
              <Music className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-foreground">ミミコーチ</h1>
              <p className="text-sm text-muted-foreground">音楽で覚える英単語</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mt-4 pb-4 border-t border-sidebar-border pt-4">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = currentScreen === item.id;
                return (
                  <Button
                    key={item.id}
                    variant={active ? 'default' : 'ghost'}
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
            <div className="mt-4 pt-4 border-t border-sidebar-border">
              <div className="flex items-center space-x-3">
                <div className="bg-muted rounded-full p-2">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:bg-sidebar lg:border-r lg:border-sidebar-border">
        <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-4 mb-8">
            <div className="bg-primary rounded-lg p-3">
              <Music className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold text-foreground">ミミコーチ</h1>
              <p className="text-sm text-muted-foreground">音楽で覚える英単語</p>
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
                  variant={isActive ? 'default' : 'ghost'}
                  className={`w-full justify-start ${
                    isActive
                      ? 'bg-primary text-primary-foreground hover:opacity-90'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
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
            <div className="bg-muted rounded-lg p-3">
              <div className="flex items-center">
                <div className="bg-primary rounded-full p-2">
                  <User className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{user.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className="lg:hidden sticky bottom-0 left-0 right-0 bg-sidebar border-t border-sidebar-border">
        <div className="grid grid-cols-5 py-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`flex flex-col items-center py-2 px-1 h-auto ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
                onClick={() => onNavigate(item.id)}
              >
                <Icon className={`h-5 w-5 mb-1 ${isActive ? 'text-primary' : ''}`} />
                <span className={`text-xs ${isActive ? 'text-primary font-medium' : ''}`}>
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

