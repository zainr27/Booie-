
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { UserDemographicData, UserAcademicData } from '@/types/custom';

interface ProfileSidebarProps {
  demographic: UserDemographicData | null | undefined;
  academic: UserAcademicData | null | undefined;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ demographic, academic }) => {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Profile Information</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {demographic ? (
          <>
            <p className="text-sm text-gray-500">
              Name: {demographic.first_name} {demographic.last_name}
            </p>
            <p className="text-sm text-gray-500">
              Age: {demographic.age}
            </p>
            {academic && (
              <p className="text-sm text-gray-500">
                School: {academic.school}
              </p>
            )}
            <Link to="/profile">
              <Button variant="secondary" className="w-full">Update Profile</Button>
            </Link>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-500">
              No profile information available.
            </p>
            <Link to="/profile">
              <Button className="w-full">Complete Profile</Button>
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileSidebar;
