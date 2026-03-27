import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Activity, AlertTriangle, Trash2, Download, LogOut, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  created_at: string;
}

interface Prediction {
  id: string;
  user_id: string;
  patient_name: string;
  risk: number;
  label: string;
  patient_data: unknown;
  created_at: string;
}

const AdminDashboard = () => {
  const { signOut, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'predictions' | 'reports'>('dashboard');

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      toast({ title: 'Access denied', description: 'You are not an admin.', variant: 'destructive' });
      navigate('/login');
    }
  }, [isAdmin, authLoading]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    const [profilesRes, predictionsRes] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('predictions').select('*').order('created_at', { ascending: false }),
    ]);
    if (profilesRes.data) setProfiles(profilesRes.data);
    if (predictionsRes.data) setPredictions(predictionsRes.data as Prediction[]);
  };

  const deleteUser = async (userId: string) => {
    await supabase.from('predictions').delete().eq('user_id', userId);
    await supabase.from('profiles').delete().eq('user_id', userId);
    toast({ title: 'User records deleted' });
    fetchData();
  };

  const deletePrediction = async (id: string) => {
    await supabase.from('predictions').delete().eq('id', id);
    toast({ title: 'Prediction deleted' });
    fetchData();
  };

  const highRiskCount = predictions.filter(p => p.label === 'High').length;

  const exportCSV = () => {
    const headers = ['Patient Name', 'Risk %', 'Label', 'Date'];
    const rows = predictions.map(p => [p.patient_name, p.risk, p.label, new Date(p.created_at).toLocaleDateString()]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'predictions_report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (authLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!isAdmin) return null;

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard' },
    { id: 'users' as const, label: 'Users' },
    { id: 'predictions' as const, label: 'Predictions' },
    { id: 'reports' as const, label: 'Reports' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          <span className="font-display font-bold text-lg">Admin Dashboard</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate('/login'); }}>
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </header>

      {/* Tabs */}
      <div className="border-b border-border bg-card px-6">
        <div className="flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-5">
              <Card>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold font-display">{profiles.length}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Predictions</p>
                    <p className="text-2xl font-bold font-display">{predictions.length}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-destructive/10 text-destructive">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">High-Risk Cases</p>
                    <p className="text-2xl font-bold font-display">{highRiskCount}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent predictions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Predictions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Risk</TableHead>
                      <TableHead>Label</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {predictions.slice(0, 5).map(p => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.patient_name}</TableCell>
                        <TableCell>{p.risk}%</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            p.label === 'High' ? 'bg-destructive/15 text-destructive' :
                            p.label === 'Moderate' ? 'bg-warning/15 text-warning' :
                            'bg-success/15 text-success'
                          }`}>
                            {p.label}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                    {predictions.length === 0 && (
                      <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No predictions yet</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'users' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="w-20">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profiles.map(p => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.display_name || 'N/A'}</TableCell>
                        <TableCell className="text-xs text-muted-foreground font-mono">{p.user_id.slice(0, 8)}...</TableCell>
                        <TableCell>{new Date(p.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => deleteUser(p.user_id)} className="text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {profiles.length === 0 && (
                      <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No users</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'predictions' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">All Predictions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Risk</TableHead>
                      <TableHead>Label</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="w-20">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {predictions.map(p => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.patient_name}</TableCell>
                        <TableCell>{p.risk}%</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            p.label === 'High' ? 'bg-destructive/15 text-destructive' :
                            p.label === 'Moderate' ? 'bg-warning/15 text-warning' :
                            'bg-success/15 text-success'
                          }`}>
                            {p.label}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => deletePrediction(p.id)} className="text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {predictions.length === 0 && (
                      <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No predictions</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'reports' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-5">
              <Card className="cursor-pointer hover:border-primary/30 transition-colors" onClick={exportCSV}>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
                    <Download className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold font-display">Export CSV</p>
                    <p className="text-sm text-muted-foreground">Download all predictions as CSV</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:border-primary/30 transition-colors" onClick={() => {
                toast({ title: 'PDF export', description: 'Use individual prediction PDF reports from the Results page.' });
              }}>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-accent/10 text-accent">
                    <Download className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold font-display">Export PDF</p>
                    <p className="text-sm text-muted-foreground">Generate PDF reports from Results page</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Prediction Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-xl bg-success/10">
                    <p className="text-2xl font-bold text-success">{predictions.filter(p => p.label === 'Low').length}</p>
                    <p className="text-sm text-muted-foreground">Low Risk</p>
                  </div>
                  <div className="p-4 rounded-xl bg-warning/10">
                    <p className="text-2xl font-bold text-warning">{predictions.filter(p => p.label === 'Moderate').length}</p>
                    <p className="text-sm text-muted-foreground">Moderate Risk</p>
                  </div>
                  <div className="p-4 rounded-xl bg-destructive/10">
                    <p className="text-2xl font-bold text-destructive">{predictions.filter(p => p.label === 'High').length}</p>
                    <p className="text-sm text-muted-foreground">High Risk</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
