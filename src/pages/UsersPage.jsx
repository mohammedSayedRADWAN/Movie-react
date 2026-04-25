import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, Link } from 'react-router';

// Icons
import { Users, ArrowRight, ShieldCheck, Star } from 'lucide-react';

// Shadcn UI Components
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardFooter,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const UsersPage = () => {
    const { t } = useTranslation();
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		(async function fetchFeaturedUsers() {
			try {
				setLoading(true);
				const response = await axios.get(
					'https://api.escuelajs.co/api/v1/users?limit=9&offset=0',
				);
				setUsers(response.data);
			} catch (error) {
				console.error('Error fetching users', error);
				setError(t('common.error'));
			} finally {
				setLoading(false);
			}
		})();
	}, [t]);

	// Helper component to render 6 skeleton cards in a grid
	const SkeletonGrid = () => (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
			{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
				<Card key={index} className='shadow-md border-border bg-card'>
					<CardHeader className='flex flex-row items-center gap-4 pb-4'>
						<Skeleton className='w-16 h-16 rounded-full' />
						<div className='flex flex-col gap-2'>
							<Skeleton className='h-6 w-32' />
							<Skeleton className='h-4 w-20 rounded-full' />
						</div>
					</CardHeader>
					<CardContent>
						<Skeleton className='h-4 w-full mb-2' />
						<Skeleton className='h-4 w-4/5' />
					</CardContent>
				</Card>
			))}
		</div>
	);

	return (
		<div className='min-h-screen bg-background transition-colors duration-300'>
			{/* 2. Featured Users Section */}
			<section className='py-12 px-6 max-w-7xl mx-auto'>
				<div className='flex items-center gap-3 mb-10 text-left rtl:text-right'>
					<Users className='w-8 h-8 text-primary' />
					<h2 className='text-3xl font-bold tracking-tight text-foreground'>{t('users.featuredMembers')}</h2>
				</div>

				{/* Error State */}
				{error && (
					<div className='text-center py-10 text-destructive font-medium bg-destructive/10 rounded-lg border border-destructive/20'>
						{error}
					</div>
				)}

				{/* Loading State using our Skeleton Grid */}
				{loading && !error && <SkeletonGrid />}

				{/* Data State using CSS Grid */}
				{!loading && !error && users.length > 0 && (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{users.map((user) => (
							<Card
								key={user.id}
								className='shadow-sm hover:shadow-md transition-all duration-300 border-border bg-card flex flex-col hover:border-primary/50'>
								<CardHeader className='flex flex-row items-center gap-4 pb-4 text-left rtl:text-right'>
									<Avatar className='w-16 h-16 border-2 border-primary/10'>
										<AvatarImage src={user.avatar} alt={user.name} />
										<AvatarFallback className='bg-primary/10 text-primary font-bold uppercase'>
											{user.name.charAt(0)}
										</AvatarFallback>
									</Avatar>
									<div className='flex flex-col gap-1'>
										<CardTitle className='text-xl text-foreground'>{user.name}</CardTitle>
										<div>
											<Badge
												variant={user.role === 'admin' ? 'default' : 'secondary'}
												className='capitalize'>
												{user.role}
											</Badge>
										</div>
									</div>
								</CardHeader>
								<CardContent className='grow text-left rtl:text-right'>
									<p className='text-sm text-muted-foreground'>
										<span className='font-semibold text-foreground'>{t('users.email')}:</span>{' '}
										{user.email}
									</p>
									{user.role === 'admin' && (
										<div className='flex items-center gap-2 mt-3 text-sm text-green-600 font-medium'>
											<ShieldCheck className='w-4 h-4' />
											{t('users.verifiedAdmin')}
										</div>
									)}
								</CardContent>
								<CardFooter className='bg-muted/30 border-t border-border pt-4 mt-auto'>
									<Button variant='ghost' className='w-full text-primary hover:bg-primary/10' asChild>
										<Link
											to={`/users/${user.id}`}
											className='font-medium'>
											{t('users.viewProfile')}
                                            <ArrowRight className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0 rtl:rotate-180" />
										</Link>
									</Button>
								</CardFooter>
							</Card>
						))}
					</div>
				)}
			</section>
		</div>
	);
};

export default UsersPage;
