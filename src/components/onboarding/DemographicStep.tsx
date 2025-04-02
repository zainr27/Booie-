
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const DemographicStep = () => {
  const { nextStep, updateDemographicData } = useOnboarding();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [ethnicity, setEthnicity] = useState('');
  const [zipCode, setZipCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be signed in to complete onboarding.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Update the onboarding context with form data
      updateDemographicData({
        firstName,
        lastName,
        age: age ? parseInt(age) : null,
        gender,
        ethnicity,
        zipCode
      });
      
      const { error } = await supabase
        .from('user_demographic_data')
        .insert([
          {
            user_id: user.id,
            age: age ? parseInt(age) : null,
            gender,
            ethnicity,
            zip_code: zipCode,
            first_name: firstName,
            last_name: lastName
          },
        ]);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Your demographic information has been saved.",
      });
      
      nextStep();
    } catch (error: any) {
      console.error("Error saving demographic data:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save your information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Personal Information</h2>
        <p className="text-muted-foreground mt-2">
          Let's start with some basic information about you.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name fields */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
        
        {/* Age field */}
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            placeholder="e.g., 25"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        
        {/* Gender selection */}
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Non-binary">Non-binary</SelectItem>
              <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Ethnicity selection */}
        <div className="space-y-2">
          <Label htmlFor="ethnicity">Ethnicity</Label>
          <Select value={ethnicity} onValueChange={setEthnicity}>
            <SelectTrigger>
              <SelectValue placeholder="Select ethnicity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="African American">African American</SelectItem>
              <SelectItem value="Asian">Asian</SelectItem>
              <SelectItem value="Hispanic/Latino">Hispanic/Latino</SelectItem>
              <SelectItem value="Native American">Native American</SelectItem>
              <SelectItem value="Pacific Islander">Pacific Islander</SelectItem>
              <SelectItem value="White">White</SelectItem>
              <SelectItem value="Multiple ethnicities">Multiple ethnicities</SelectItem>
              <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Zip code field */}
        <div className="space-y-2">
          <Label htmlFor="zipCode">Zip Code</Label>
          <Input
            id="zipCode"
            placeholder="e.g., 90210"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span className="ml-2">Saving...</span>
            </div>
          ) : (
            'Continue to Next Step'
          )}
        </Button>
      </form>
    </motion.div>
  );
};

export default DemographicStep;
