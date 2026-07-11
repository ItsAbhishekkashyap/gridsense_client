'use client';

import { useEffect, useState } from 'react';
import { User, Settings, Lock } from 'lucide-react';
import { useAuth } from '../../../../hooks/useAuth';
import { systemApi } from '../../../../lib/api';
import { Card, CardHeader, CardTitle } from '../../../../components/ui/Card';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';
import { Loader } from '../../../../components/ui/Loader';
import { toast } from '../../../../components/ui/Toast';

export default function SettingsPage() {
  const { user } = useAuth();
  const [config, setConfig] = useState({ systemName: '', location: '', tariffRate: '', totalCapacity: '' });
  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await systemApi.getConfig();
        const c = res.data.data.config;
        setConfig({
          systemName: c.systemName,
          location: c.location,
          tariffRate: String(c.tariffRate),
          totalCapacity: String(c.totalCapacity),
        });
      } catch {
        toast.error('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
    if (user) {
      setProfileForm({ name: user.name, email: user.email });
    }
  }, [user]);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingConfig(true);
    try {
      await systemApi.updateConfig({
        systemName: config.systemName,
        location: config.location,
        tariffRate: parseFloat(config.tariffRate),
        totalCapacity: parseFloat(config.totalCapacity),
      });
      toast.success('System configuration saved');
    } catch {
      toast.error('Failed to save configuration');
    } finally {
      setIsSavingConfig(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-16"><Loader size="lg" /></div>;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-gray-500">Manage your account and system preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-accent" />
              System Configuration
            </div>
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSaveConfig} className="space-y-4">
          <Input
            label="System Name"
            value={config.systemName}
            onChange={(e) => setConfig({ ...config, systemName: e.target.value })}
          />
          <Input
            label="Location"
            value={config.location}
            onChange={(e) => setConfig({ ...config, location: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Tariff Rate (₹/kWh)"
              type="number"
              step="0.1"
              value={config.tariffRate}
              onChange={(e) => setConfig({ ...config, tariffRate: e.target.value })}
            />
            <Input
              label="Total Capacity (kW)"
              type="number"
              step="0.1"
              value={config.totalCapacity}
              onChange={(e) => setConfig({ ...config, totalCapacity: e.target.value })}
            />
          </div>
          <Button type="submit" isLoading={isSavingConfig}>
            Save Configuration
          </Button>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-accent" />
              Profile
            </div>
          </CardTitle>
        </CardHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Name</p>
              <p className="text-sm text-white">{user?.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Email</p>
              <p className="text-sm text-white">{user?.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Plan</p>
              <p className="text-sm text-accent font-medium uppercase">{user?.plan}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Member since</p>
              <p className="text-sm text-white">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' }) : '--'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-accent" />
              Change Password
            </div>
          </CardTitle>
        </CardHeader>
        <div className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            value={passwordForm.current}
            onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
          />
          <Input
            label="New Password"
            type="password"
            value={passwordForm.newPass}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={passwordForm.confirm}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
          />
          <Button
            variant="secondary"
            onClick={() => toast.success('Password change coming soon')}
          >
            Update Password
          </Button>
        </div>
      </Card>
    </div>
  );
}
