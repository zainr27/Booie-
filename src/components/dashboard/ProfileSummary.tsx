
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

type UserData = {
  demographic?: {
    age: number | null;
    gender: string | null;
    ethnicity: string | null;
    zip_code: string | null;
    first_name?: string | null;
    last_name?: string | null;
  };
  academic?: {
    school: string;
    degree_program: string;
    major: string;
    graduation_year: number | null;
  };
  financial?: {
    current_income: number | null;
    household_income: number | null;
    dependents: number | null;
    funding_required: number | null;
  };
};

interface ProfileSummaryProps {
  userData: UserData | null;
}

const ProfileSummary = ({ userData }: ProfileSummaryProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const getInitials = () => {
    if (userData?.demographic?.first_name && userData?.demographic?.last_name) {
      return `${userData.demographic.first_name.charAt(0)}${userData.demographic.last_name.charAt(0)}`.toUpperCase();
    }
    if (userData?.demographic?.first_name) {
      return userData.demographic.first_name.substring(0, 2).toUpperCase();
    }
    if (!user?.email) return '?';
    return user.email.substring(0, 2).toUpperCase();
  };

  const getDisplayName = () => {
    if (userData?.demographic?.first_name && userData?.demographic?.last_name) {
      return `${userData.demographic.first_name} ${userData.demographic.last_name}`;
    }
    if (userData?.demographic?.first_name) {
      return userData.demographic.first_name;
    }
    return user?.email;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src="" />
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{getDisplayName()}</p>
          <p className="text-sm text-muted-foreground">
            {userData?.demographic?.zip_code && `Location: ${userData.demographic.zip_code}`}
          </p>
        </div>
      </div>

      <div className="pt-2 space-y-3">
        {userData?.demographic && (
          <>
            {userData.demographic.age && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Age:</span>
                <span className="font-medium">{userData.demographic.age}</span>
              </div>
            )}
            
            {userData.demographic.gender && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gender:</span>
                <span className="font-medium">{userData.demographic.gender}</span>
              </div>
            )}
            
            {userData.demographic.ethnicity && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ethnicity:</span>
                <span className="font-medium">{userData.demographic.ethnicity}</span>
              </div>
            )}
          </>
        )}
      </div>

      <Button 
        variant="outline" 
        size="sm" 
        className="w-full mt-2"
        onClick={() => navigate('/profile')}
      >
        Edit Profile
      </Button>
    </div>
  );
};

export default ProfileSummary;
