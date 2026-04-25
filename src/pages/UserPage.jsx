import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';

// Lucide icons for spinner, error, and new metadata rows
import {
	Loader2,
	AlertCircle,
	Mail,
	Hash,
	CalendarDays,
	ShieldAlert,
} from 'lucide-react';

// Shadcn UI Components
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
	CardFooter,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

const UserPage = () => {
    const { t, i18n } = useTranslation();
	const { id } = useParams();

	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		(async function fetchUser() {
			try {
				setLoading(true);
				const response = await axios.get(`https://api.escuelajs.co/api/v1/users/${id}`);
				setUser(response.data);
			} catch (error) {
				console.error('Error fetching', error);
				setError(t('common.error'));
			} finally {
				setLoading(false);
			}
		})();
	}, [id, t]);

	if (loading) {
		return (
			<div className='max-w-md mx-auto mt-10 p-4 transition-colors duration-300'>
				<Card className='shadow-xl border-border bg-card/50 backdrop-blur-md'>
					<CardHeader className='flex flex-row items-center gap-5 pb-4 text-left rtl:text-right'>
						<Skeleton className='w-24 h-24 rounded-full' />
						<div className='flex flex-col gap-3'>
							<Skeleton className='h-8 w-48' />
							<Skeleton className='h-6 w-20 rounded-full' />
						</div>
					</CardHeader>

					<Separator className='mb-6' />

					<CardContent className='space-y-6'>
						<Skeleton className='h-5 w-full' />
						<Skeleton className='h-5 w-3/4' />
						<Skeleton className='h-5 w-5/6' />
						<Skeleton className='h-5 w-2/3' />
					</CardContent>

					<CardFooter className='flex justify-end gap-3 pt-6 bg-muted/20 rounded-b-2xl border-t border-border'>
						<Skeleton className='h-10 w-28 rounded-full' />
						<Skeleton className='h-10 w-32 rounded-full' />
					</CardFooter>
				</Card>
			</div>
		);
	}

	if (error) {
		return (
			<div className='max-w-md mx-auto mt-10 p-4'>
				<Alert variant='destructive' className="bg-destructive/10 border-destructive/20 text-destructive">
					<AlertCircle className='h-4 w-4' />
					<AlertTitle>{t('common.error')}</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			</div>
		);
	}

	if (!user) return null;

	const formattedDate = new Date(user.creationAt).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});

	return (
		<div className='max-w-xl mx-auto mt-12 p-4 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4'>
			<Card className='shadow-2xl border-border bg-card/80 backdrop-blur-lg overflow-hidden rounded-3xl'>
                <div className="h-32 bg-linear-to-r from-primary/30 via-primary/10 to-transparent" />
				
				<CardHeader className='flex flex-col sm:flex-row items-center sm:items-end gap-5 pb-6 -mt-16 text-center sm:text-left rtl:sm:text-right'>
					<div className="relative">
                        <Avatar className='w-32 h-32 border-4 border-background shadow-2xl'>
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className='text-3xl bg-primary/10 text-primary font-black uppercase'>
                                {user.name?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-2 border-background rounded-full" />
                    </div>

					<div className='flex flex-col gap-2 pb-2'>
						<CardTitle className='text-3xl font-black text-foreground'>{user.name}</CardTitle>
						<div className="flex justify-center sm:justify-start">
							<Badge
								variant={user.role === 'admin' ? 'default' : 'secondary'}
								className='capitalize px-4 py-1 font-bold'>
								{user.role}
							</Badge>
						</div>
					</div>
				</CardHeader>

				<Separator className='mx-6 w-auto opacity-50' />

				<CardContent className='p-8 space-y-6 text-left rtl:text-right'>
					<div className='flex items-center gap-4 text-sm group'>
						<div className="p-2 rounded-lg bg-muted/50 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                            <Mail className='w-4 h-4' />
                        </div>
						<div className="flex flex-col">
                            <span className='text-[10px] uppercase font-black tracking-widest text-muted-foreground'>{t('users.email')}</span>
						    <span className='font-bold text-foreground'>{user.email}</span>
                        </div>
					</div>

					<div className='flex items-center gap-4 text-sm group'>
						<div className="p-2 rounded-lg bg-muted/50 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                            <Hash className='w-4 h-4' />
                        </div>
                        <div className="flex flex-col">
                            <span className='text-[10px] uppercase font-black tracking-widest text-muted-foreground'>{t('users.userId')}</span>
						    <span className='font-bold text-foreground'>{user.id}</span>
                        </div>
					</div>

					<div className='flex items-center gap-4 text-sm group'>
						<div className="p-2 rounded-lg bg-muted/50 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                            <CalendarDays className='w-4 h-4' />
                        </div>
                        <div className="flex flex-col">
                            <span className='text-[10px] uppercase font-black tracking-widest text-muted-foreground'>{t('users.joined')}</span>
						    <span className='font-bold text-foreground'>{formattedDate}</span>
                        </div>
					</div>

					{user.password && (
						<div className='flex items-center gap-4 text-sm group'>
						    <div className="p-2 rounded-lg bg-muted/50 text-destructive group-hover:bg-destructive group-hover:text-destructive-foreground transition-all">
                                <ShieldAlert className='w-4 h-4' />
                            </div>
                            <div className="flex flex-col">
                                <span className='text-[10px] uppercase font-black tracking-widest text-muted-foreground'>{t('users.security')}</span>
						        <span className='font-bold text-destructive'>{t('users.passwordSet')}</span>
                            </div>
						</div>
					)}
				</CardContent>

				<CardFooter className='flex flex-wrap justify-end gap-3 p-6 bg-muted/20 border-t border-border'>
					<Button variant='outline' className="rounded-full px-6 font-bold uppercase text-[10px] tracking-widest border-border transition-all hover:scale-105 active:scale-95">
						{t('users.editProfile')}
					</Button>
					<Button className="rounded-full px-8 font-black uppercase text-[10px] tracking-widest bg-primary text-primary-foreground transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
                        {t('users.contactUser')}
                    </Button>
				</CardFooter>
			</Card>
		</div>
	);
};

export default UserPage;
