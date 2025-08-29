import React from 'react';
import { Edit2, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { User } from '@/api'; // Backend type

interface UserListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditUser: (user: User) => void;
  users: User[];
}

const UserListModal: React.FC<UserListModalProps> = ({ isOpen, onClose, onEditUser, users }) => {
  const { language, t } = useLanguage();

  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-salon-gold">
            <Users className="w-5 h-5" />
            {t('allUsers')}
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[60vh] space-y-3">
          {users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>{t('noUsersFound')}</p>
            </div>
          ) : (
            users.map((user, index) => (
              <Card key={user.id ?? index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{user.name}</h3>
                    <p className={`text-muted-foreground ${language === 'ar' ? 'text-right' : 'text-left'}`} dir="ltr">{user.phone}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditUser(user)}
                    className="flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    {t('edit')}
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserListModal;
