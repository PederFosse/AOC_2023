import { type MetaFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { json } from 'react-router';
import { StarIcon } from '@heroicons/react/24/solid';

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }];
};

export const loader = async () => {
  let progress: string[];
  try {
    const sessionCookie = process.env.AOC_SESSION_COOKIE;
    if (!sessionCookie) {
      throw new Error('Missing session cookie from env');
    }
    const progressDoc = await fetch(`https://adventofcode.com/2023`, {
      headers: {
        cookie: sessionCookie,
      },
    });

    progress = (await progressDoc.text()).split('\n');
  } catch (err) {
    progress = [];
  }

  const days = Array.from({ length: 24 }).map((_, i) => {
    const day = (i + 1).toString();
    let stars = 0;
    const currentDayResult = progress.find((str) => str.includes(`href="/2023/day/${day}"`));
    if (currentDayResult?.includes('two stars')) {
      stars = 2;
    } else if (currentDayResult?.includes('one star')) {
      stars = 1;
    } else {
      stars = 0;
    }

    return { day, stars };
  });

  return json({ days });
};

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <div className="grid grid-cols-4 md:grid-cols-6 gap-5 md:gap-9 lg:gap-12 xl:gap-24 m-20">
      {loaderData.days && // @ts-ignore
        loaderData.days.map((day) => {
          return <LinkToDay day={day.day} stars={day.stars} key={day.day} />;
        })}
    </div>
  );
}

function LinkToDay({ day, stars }: { day: string; stars: number }) {
  return (
    <Link
      to={`/day/${day}`}
      className="text-black bg-gradient-to-tr focus:outline-none focus:ring-white focus:ring group from-orange-500 to-red-900 rounded-lg h-28 flex items-center justify-center relative"
    >
      <div className="absolute inset-0 h-full w-full rounded-lg shadow-lg shadow-green-700 transition group-hover:shadow-green-500  group-hover:animate-pulse group-focus:shadow-green-500  group-focus:animate-pulse" />
      <div className="  flex items-center justify-center">
        Day {day}
        <span className="ml-1 flex">
          {Array.from({ length: stars }).map((_, i) => {
            return <StarIcon key={i} className="h-3 text-yellow-300" />;
          })}
        </span>
      </div>
    </Link>
  );
}
