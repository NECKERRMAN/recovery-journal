import { Button } from '@/components/ui/button';
import { RegisterLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { getDictionary } from './dictionaries';

export default async function Home({ params: { lang } }: any) {
  const dict = await getDictionary(lang)
  
  return (
    <section className="flex items-center justify-center bg-background h-[90vh]">
      <div className="relative items-center w-full px-5 py-12 mx-auto lg:px-16 max-w-7xl md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <div>
            <span className="w-auto px-6 py-3 rounded-full bg-secondary">
              <span className="text-sm font-medium text-primary">
                {dict.onboarding.subtitle}
              </span>
            </span>

            <h1 className="mt-8 font-extrabold text-3xl tracking-light lg:text-6xl">
              {dict.onboarding.title}
            </h1>

            <p className="max-w-xl mx-auto mt-8 text-base lg:text-xl text-secondary-foreground">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore et d
            </p>
          </div>

          <div className="flex justify-center max-w-sm mx-auto mt-10">
            <RegisterLink>
              <Button size="lg" className="w-full">
                {dict.onboarding.signUpForFree}
              </Button>
            </RegisterLink>
          </div>
        </div>
      </div>
    </section>
  );
}
