import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Chessboard } from "react-chessboard";
import Countdown from "react-countdown";
import { useElementSize } from "usehooks-ts";
import { Color } from "chess.js";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import ChessBars from "../components/chess-bars";
import useChess from "../stores/chess";
import MoveList from "../components/move-list";
import Loading from "../components/loading";
import ChessStart from "../components/chess-start";

const myTurn: Color = "w";

const Black: React.FC = () => (
  <svg
    className=" w-7 h-7"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
  >
    <path d="M144 16c0-8.8-7.2-16-16-16s-16 7.2-16 16V32H96c-8.8 0-16 7.2-16 16s7.2 16 16 16h16V96H59.4C48.7 96 40 104.7 40 115.4c0 3 .7 5.9 2 8.7c6 12.4 23.8 50.8 32.8 83.9H72c-13.3 0-24 10.7-24 24s10.7 24 24 24h7.7C78 302.9 69.4 352.7 63.1 384H192.9c-6.4-31.3-14.9-81.1-16.6-128H184c13.3 0 24-10.7 24-24s-10.7-24-24-24h-2.8c9-33.2 26.8-71.5 32.8-83.9c1.3-2.7 2-5.6 2-8.7c0-10.7-8.7-19.4-19.4-19.4H144V64h16c8.8 0 16-7.2 16-16s-7.2-16-16-16H144V16zM25.2 451.4l-8.8 4.4C6.3 460.8 0 471.1 0 482.3C0 498.7 13.3 512 29.7 512H226.3c16.4 0 29.7-13.3 29.7-29.7c0-11.2-6.3-21.5-16.4-26.5l-8.8-4.4c-4.1-2.1-6.8-6.3-6.8-10.9c0-13.5-10.9-24.4-24.4-24.4H56.4C42.9 416 32 426.9 32 440.4c0 4.6-2.6 8.9-6.8 10.9zm279.2 4.4c-10.1 5-16.4 15.3-16.4 26.5c0 16.4 13.3 29.7 29.7 29.7H482.3c16.4 0 29.7-13.3 29.7-29.7c0-11.2-6.3-21.5-16.4-26.5l-8.8-4.4c-4.1-2.1-6.8-6.3-6.8-10.9c0-13.5-10.9-24.4-24.4-24.4H344.4c-13.5 0-24.4 10.9-24.4 24.4c0 4.6-2.6 8.9-6.8 10.9l-8.8 4.4zM304 259.9c0 7.8 2.8 15.3 8 21.1l18.9 21.4c5.4 6.1 8.2 14 8 22.1L337 384H462.5l-2.7-58.7c-.4-8.5 2.6-16.9 8.4-23.1l19.3-21c5.4-5.9 8.5-13.6 8.5-21.7V200c0-4.4-3.6-8-8-8H464c-4.4 0-8 3.6-8 8v16c0 4.4-3.6 8-8 8h-8c-4.4 0-8-3.6-8-8V200c0-4.4-3.6-8-8-8H376c-4.4 0-8 3.6-8 8v16c0 4.4-3.6 8-8 8h-8c-4.4 0-8-3.6-8-8V200c0-4.4-3.6-8-8-8H312c-4.4 0-8 3.6-8 8v59.9zM392 336c-4.4 0-8-3.6-8-8V304c0-8.8 7.2-16 16-16s16 7.2 16 16v24c0 4.4-3.6 8-8 8H392z" />
  </svg>
);

const White: React.FC = () => (
  <svg
    className="invert w-7 h-7"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
  >
    <path d="M144 16c0-8.8-7.2-16-16-16s-16 7.2-16 16V32H96c-8.8 0-16 7.2-16 16s7.2 16 16 16h16V96H59.4C48.7 96 40 104.7 40 115.4c0 3 .7 5.9 2 8.7c6 12.4 23.8 50.8 32.8 83.9H72c-13.3 0-24 10.7-24 24s10.7 24 24 24h7.7C78 302.9 69.4 352.7 63.1 384H192.9c-6.4-31.3-14.9-81.1-16.6-128H184c13.3 0 24-10.7 24-24s-10.7-24-24-24h-2.8c9-33.2 26.8-71.5 32.8-83.9c1.3-2.7 2-5.6 2-8.7c0-10.7-8.7-19.4-19.4-19.4H144V64h16c8.8 0 16-7.2 16-16s-7.2-16-16-16H144V16zM25.2 451.4l-8.8 4.4C6.3 460.8 0 471.1 0 482.3C0 498.7 13.3 512 29.7 512H226.3c16.4 0 29.7-13.3 29.7-29.7c0-11.2-6.3-21.5-16.4-26.5l-8.8-4.4c-4.1-2.1-6.8-6.3-6.8-10.9c0-13.5-10.9-24.4-24.4-24.4H56.4C42.9 416 32 426.9 32 440.4c0 4.6-2.6 8.9-6.8 10.9zm279.2 4.4c-10.1 5-16.4 15.3-16.4 26.5c0 16.4 13.3 29.7 29.7 29.7H482.3c16.4 0 29.7-13.3 29.7-29.7c0-11.2-6.3-21.5-16.4-26.5l-8.8-4.4c-4.1-2.1-6.8-6.3-6.8-10.9c0-13.5-10.9-24.4-24.4-24.4H344.4c-13.5 0-24.4 10.9-24.4 24.4c0 4.6-2.6 8.9-6.8 10.9l-8.8 4.4zM304 259.9c0 7.8 2.8 15.3 8 21.1l18.9 21.4c5.4 6.1 8.2 14 8 22.1L337 384H462.5l-2.7-58.7c-.4-8.5 2.6-16.9 8.4-23.1l19.3-21c5.4-5.9 8.5-13.6 8.5-21.7V200c0-4.4-3.6-8-8-8H464c-4.4 0-8 3.6-8 8v16c0 4.4-3.6 8-8 8h-8c-4.4 0-8-3.6-8-8V200c0-4.4-3.6-8-8-8H376c-4.4 0-8 3.6-8 8v16c0 4.4-3.6 8-8 8h-8c-4.4 0-8-3.6-8-8V200c0-4.4-3.6-8-8-8H312c-4.4 0-8 3.6-8 8v59.9zM392 336c-4.4 0-8-3.6-8-8V304c0-8.8 7.2-16 16-16s16 7.2 16 16v24c0 4.4-3.6 8-8 8H392z" />
  </svg>
);

const Chess: React.FC = () => {
  const {
    connect,
    connecting,
    loading,
    getTweets,
    tweets,
    error,
    algebraic,
    gameover,
    move,
    forfeit,
    end,
    turn,
    code,
    game,
  } = useChess((s) => s);
  const { handleSubmit, register } = useForm<{ code: string }>({
    reValidateMode: "onSubmit",
    mode: "onSubmit",
  });
  const [authorized, setAuthorized] = useState(false);
  const [getRef, { width: chessWidth, height: chessHeight }] = useElementSize();
  const { width, height } = useWindowSize();

  useEffect(() => {
    connect();
  }, []);

  if (connecting)
    return (
      <div className="flex flex-1">
        <div className="flex flex-1 items-center justify-center">
          <Loading />
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-1">
        <div className="flex flex-1 items-center justify-center ">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="p-6 text-center">
              <svg
                aria-hidden="true"
                className="mx-auto mb-4 w-14 h-14 text-gray-400 dark:text-gray-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Errore: {error}
              </h3>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex flex-1 flex-col md:flex-row p-5">
      {loading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-white rounded-lg shadow dark:bg-gray-700 opacity-80 p-5">
          <Loading />
        </div>
      )}
      {gameover != null && (
        <>
          <div className="flex flex-col items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg shadow dark:bg-gray-700 py-4 px-6">
            {gameover == "d"
              ? "Pareggio"
              : gameover == "f"
              ? "Il giocatore si è arreso, vince il Nero"
              : `Scacco matto, vince il ${gameover == "w" ? "Bianco" : "Nero"}`}
            ! La partita e' finita.
            <ChessStart onAuthorize={() => setAuthorized(true)} />
          </div>
          <Confetti width={width} height={height} />
        </>
      )}
      {!code ? (
        <ChessStart onAuthorize={() => setAuthorized(true)} />
      ) : (
        <>
          <div className="flex basis-2/4 xs:justify-center md:justify-left">
            <div
              ref={getRef}
              className="flex flex-1 lg:flex-initial aspect-square "
            >
              <Chessboard
                boardWidth={Math.min(chessWidth, chessHeight - 10)}
                arePiecesDraggable={authorized && turn == myTurn}
                position={game!}
                isDraggablePiece={({ piece }) =>
                  (piece.charAt(0) as Color) == myTurn
                }
                onPieceDrop={(src, dest, piece) => {
                  const mv = algebraic(src, dest, piece);
                  if (mv == null) return false;
                  else move(mv);

                  return true;
                }}
              />
            </div>
          </div>
          {!gameover && (
            <div className="flex basis-1/4 flex-col lg:items-center">
              <form
                onClick={handleSubmit((_) => setAuthorized(true))}
                className="flex justify-center"
              >
                <div>
                  <label
                    htmlFor="code"
                    className="flex mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                  >
                    {!authorized && "Inserisci codice partita per giocare:"}
                    {authorized && "Puoi giocare! Codice partita:"}
                  </label>
                  <div className="flex">
                    <input
                      id="code"
                      type="search"
                      className="flex p-4 pl-10 hover:border-gray-400 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"
                      placeholder={authorized ? code! : "Codice..."}
                      disabled={authorized}
                      {...register("code", {
                        validate: (value) => value == code,
                      })}
                    />
                    {!authorized && (
                      <button
                        type="submit"
                        className="text-white hover:bg-sky-700 bg-sky-700 hover:bg-sky-800 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800"
                      >
                        Invia
                      </button>
                    )}
                  </div>
                </div>
              </form>
              {authorized && (
                <button
                  className="my-4 text-white mx-auto hover:bg-red-700 right-2.5 bottom-2.5 bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 disabled:hover:bg-slate-700 disabled:bg-slate-600 disabled:cursor-not-allowed"
                  onClick={(_) => forfeit()}
                >
                  Arrenditi
                </button>
              )}
              <div className="flex flex-row m-3 p-1 self-center border border-orange-300 dark:bg-opacity-50 bg-opacity-40 bg-orange-400 shadow-md shadow-orange-300">
                <div className="my-auto p-2">
                  <White />
                </div>
                <div className="flex flex-row p-1 my-2 w-fit">
                  {turn == myTurn ? (
                    <Countdown date={end!.toDate("utc")} />
                  ) : (
                    "00:00:00:00"
                  )}
                </div>
              </div>
              <div className="flex flex-row m-3 p-1 self-center border border-orange-300 dark:bg-opacity-50 bg-opacity-40 bg-orange-400 shadow-md shadow-orange-300">
                <div className="my-auto p-2">
                  <Black />
                </div>
                <div className="flex flex-row p-1 my-2 w-fit">
                  {turn != myTurn ? (
                    <Countdown date={end!.toDate("utc")} />
                  ) : (
                    "00:00:00:00"
                  )}
                </div>
              </div>
              <div className="flex flex-1 w-96 p-2 m-1 self-center">
                <ChessBars />
              </div>
            </div>
          )}
          <div className="flex flex-1 basis-1/4 flex-col p-2">
            <button
              className="text-white mx-auto hover:bg-sky-700 right-2.5 bottom-2.5 bg-sky-700 hover:bg-sky-800 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800 disabled:hover:bg-slate-700 disabled:bg-slate-600 disabled:cursor-not-allowed"
              disabled={turn == myTurn}
              onClick={(_) => getTweets()}
            >
              Aggiorna i tweets
            </button>
            <MoveList tweets={tweets || []} />
          </div>
        </>
      )}
    </div>
  );
};

export default Chess;
