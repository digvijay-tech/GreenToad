export default async function Board({ params }) {
  const boardId = (await params).board;

  return (
    <div className="mt-[60px] container mx-auto">Boards ID is {boardId}</div>
  );
}
