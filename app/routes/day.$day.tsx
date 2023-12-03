import { type ActionFunctionArgs, type LoaderFunctionArgs } from '@remix-run/node';
import { Link, useFetcher, useLoaderData, useParams } from '@remix-run/react';
import { json } from 'react-router';
import { TaskSolver } from '~/days/task-solver';
import { classNames } from '~/utils';

export async function loader({ params }: LoaderFunctionArgs) {
  const taskSolver = TaskSolver.getInstance();

  if (typeof params.day !== 'string') {
    return json('Invalid params, missing day', { status: 400 });
  }

  const task = taskSolver.getTask(params.day);
  if (!task) {
    return json('Task not found', { status: 404 });
  }

  if ('implemented' in task && task.implemented === false) {
    return json({ notImplemeted: true }, { status: 503 });
  }

  return json('Task exists and is ready to be solved', { status: 200 });
}

export async function action({ request, params }: ActionFunctionArgs) {
  if (typeof params.day !== 'string') {
    return json('Invalid params, missing day', { status: 400 });
  }

  const formData = await request.formData();

  const testData = formData.get('test-data');

  let data: string;

  if (testData && typeof testData === 'string') {
    // <textarea> component uses \r\n for line-breaks
    data = testData.replaceAll('\r', '');
  } else {
    try {
      const sessionCookie = process.env.AOC_SESSION_COOKIE;
      if (!sessionCookie) {
        throw new Error('Missing session cookie from env');
      }
      const fileContents = await fetch(`https://adventofcode.com/2023/day/${params.day}/input`, {
        headers: {
          cookie: sessionCookie,
        },
      });

      data = await fileContents.text();
    } catch (err) {
      return json('Failed getting input data', { status: 404 });
    }
  }

  const task = TaskSolver.getInstance().getTask(params.day);
  if (!task) {
    return json('Task not found', { status: 404 });
  }

  return task.solve(data);
}

export default function Day() {
  const fetcher = useFetcher();
  const params = useParams();
  const loaderData = useLoaderData<typeof loader>();

  return (
    <div className={classNames('p-5 min-h-screen w-full')}>
      <div className="flex items-center space-x-4">
        <Link
          to={'/'}
          className="focus:outline-none focus:ring focus:ring-white ml-3 border border-gray-700 shadow-md rounded-lg p-1 bg-gray-800"
        >
          🏠
        </Link>
        <h1>Day {params.day}</h1>
      </div>
      <div>
        {loaderData.notImplemeted ? (
          <div className="flex items-center mt-5 justify-center bg-gray-900 p-5 rounded-lg">
            <p className="">Task is not yet implemented</p>
            <Link
              to={'/'}
              className="focus:outline-none focus:ring focus:ring-white ml-3 border border-gray-700 shadow-md rounded-lg p-1 bg-gray-800"
            >
              {' '}
              ⏪ Home
            </Link>
          </div>
        ) : (
          <div className="mt-24 flex items-center justify-center h-[40rem]">
            <div className="h-full  w-1/2 lg:w-1/3 border-r-2 border-gray-500 border-dotted pr-4">
              <fetcher.Form
                method="post"
                encType="multipart/form-data"
                className="font-primary flex flex-col rounded-lg h-full"
              >
                <textarea
                  name="test-data"
                  className="focus:outline-none focus:ring focus:ring-white  p-2 border-gray-900 border shadow-sm rounded-lg h-96 bg-gray-500 text-wallpaper"
                />
                <div className="flex justify-center mt-3 items-center">
                  <button
                    type="submit"
                    className="focus:outline-none focus:ring focus:ring-white text-wallpaper bg-secondary px-5 py-2 rounded-md"
                  >
                    Solve task
                  </button>
                </div>
              </fetcher.Form>
            </div>
            <div className="h-full grow break-words bg-gray-900/90 rounded-lg mx-14 pl-4 ">
              <div className="max-h-full overflow-auto">
                <pre className={classNames('', fetcher.data && 'p-3')}>{JSON.stringify(fetcher.data, null, 2)}</pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
