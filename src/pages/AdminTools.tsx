
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { makeUserAdmin } from '@/utils/adminUtils';
import { toast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';

const AdminTools = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleMakeAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        variant: "destructive",
        title: "Email Required",
        description: "Please enter an email address."
      });
      return;
    }

    setLoading(true);
    try {
      await makeUserAdmin(email);
      setEmail('');
    } catch (error) {
      console.error("Error making user admin:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-6">Admin Tools</h2>
        
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-amber-800">
            Caution: Admin privileges grant full access to user data and applications.
            Only add trusted individuals.
          </p>
        </div>
        
        <form onSubmit={handleMakeAdmin} className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="block text-sm font-medium mb-1">
              User Email
            </label>
            <div className="flex gap-2">
              <Input 
                id="admin-email"
                type="email" 
                placeholder="user@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="flex-1"
              />
              <Button 
                type="submit" 
                disabled={loading}
              >
                {loading ? "Processing..." : "Make Admin"}
              </Button>
            </div>
          </div>
        </form>
        
        <div className="mt-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin')}
          >
            Back to Admin Panel
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTools;
