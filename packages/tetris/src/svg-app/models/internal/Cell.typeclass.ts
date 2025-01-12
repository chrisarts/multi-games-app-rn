import type { Bifunctor, Functor } from '@games/shared/fp';

export type TetrisCell<E, A> = Invalid<E> | Valid<A>;

export interface Invalid<E> {
  readonly _tag: 'Invalid';
  readonly invalid: E;
}

export interface Valid<A> {
  readonly _tag: 'Valid';
  readonly valid: A;
}

export const invalid = <E, A = never>(e: E): TetrisCell<E, A> => ({
  _tag: 'Invalid',
  invalid: e,
});

export const valid = <A, E = never>(a: A): TetrisCell<E, A> => ({
  _tag: 'Valid',
  valid: a,
});

export const isInvalid = <E, A>(x: TetrisCell<E, A>): x is Invalid<E> =>
  x._tag === 'Invalid';

export type Match = <E, A, B>(
  onInvalid: (e: E) => B,
  onValid: (a: A) => B,
) => (x: TetrisCell<E, A>) => B;

export const match: Match = (onInvalid, onValid) => (x) =>
  isInvalid(x) ? onInvalid(x.invalid) : onValid(x.valid);

export type Map = <E, A, B>(f: (x: A) => B) => (Fx: TetrisCell<E, A>) => TetrisCell<E, B>;

export const map: Map = (f) =>
  match(
    (e) => invalid(e),
    (a) => valid(f(a)),
  );

export const functor: Functor.Functor2<'TetrisCell'> = {
  URI: 'TetrisCell',
  map: (f) =>
    match(
      (e) => invalid(e),
      (a) => valid(f(a)),
    ),
};

export const bifunctor: Bifunctor.Bifunctor2<'TetrisCell'> = {
  URI: 'TetrisCell',
  bimap: (f, g) =>
    match(
      (a) => invalid(f(a)),
      (b) => valid(g(b)),
    ),
};

declare module 'fp-ts/HKT' {
  interface URItoKind2<E, A> {
    TetrisCell: TetrisCell<E, A>;
  }
}
