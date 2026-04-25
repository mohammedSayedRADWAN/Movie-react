import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { FileQuestion, Home, Mail } from 'lucide-react';

export default function NotFound() {
    const { t } = useTranslation();

	return (
		<div className='flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 relative overflow-hidden transition-colors duration-300'>
			{/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className='relative z-10 mx-auto flex max-w-lg flex-col items-center justify-center text-center space-y-8'>
				{/* 404 Illustration */}
				<div className='relative group'>
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-all duration-500 scale-150" />
                    <div className='relative flex h-32 w-32 items-center justify-center rounded-full bg-card border border-border shadow-2xl transition-transform duration-500 hover:rotate-12'>
                        <FileQuestion className='h-16 w-16 text-primary' />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter shadow-lg">Error</div>
                </div>

                <div className="space-y-4">
				    <h1 className='text-8xl font-black tracking-tighter text-foreground opacity-10 leading-none'>404</h1>
				    <h2 className='text-3xl md:text-4xl font-black tracking-tight text-foreground uppercase'>
					    {t('error.title')}
				    </h2>
				    <p className='text-muted-foreground text-lg max-w-sm mx-auto leading-relaxed'>
					    {t('error.message')}
				    </p>
                </div>

				{/* Call to Action Buttons */}
				<div className='flex w-full flex-col gap-4 sm:flex-row sm:justify-center pt-4'>
                    <Link to='/' className="w-full sm:w-auto">
                        <Button className='w-full h-12 px-8 rounded-full font-black uppercase text-xs tracking-widest bg-primary text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2'>
                            <Home className='h-4 w-4' />
                            {t('error.backHome')}
                        </Button>
                    </Link>

                    <Button variant='outline' className='w-full sm:w-auto h-12 px-8 rounded-full font-bold uppercase text-xs tracking-widest border-border hover:bg-muted transition-all hover:scale-105 flex items-center gap-2'>
                        <Mail className="h-4 w-4" />
                        {t('error.contactSupport')}
                    </Button>
				</div>
			</div>
		</div>
	);
}
