
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model JiraConnectionSetting
 * 
 */
export type JiraConnectionSetting = $Result.DefaultSelection<Prisma.$JiraConnectionSettingPayload>
/**
 * Model JiraPageConfig
 * 
 */
export type JiraPageConfig = $Result.DefaultSelection<Prisma.$JiraPageConfigPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const UserRole: {
  ADMIN: 'ADMIN',
  VIEWER: 'VIEWER'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

}

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.jiraConnectionSetting`: Exposes CRUD operations for the **JiraConnectionSetting** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more JiraConnectionSettings
    * const jiraConnectionSettings = await prisma.jiraConnectionSetting.findMany()
    * ```
    */
  get jiraConnectionSetting(): Prisma.JiraConnectionSettingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.jiraPageConfig`: Exposes CRUD operations for the **JiraPageConfig** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more JiraPageConfigs
    * const jiraPageConfigs = await prisma.jiraPageConfig.findMany()
    * ```
    */
  get jiraPageConfig(): Prisma.JiraPageConfigDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.7.0
   * Query Engine version: 3cff47a7f5d65c3ea74883f1d736e41d68ce91ed
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    JiraConnectionSetting: 'JiraConnectionSetting',
    JiraPageConfig: 'JiraPageConfig'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "jiraConnectionSetting" | "jiraPageConfig"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      JiraConnectionSetting: {
        payload: Prisma.$JiraConnectionSettingPayload<ExtArgs>
        fields: Prisma.JiraConnectionSettingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.JiraConnectionSettingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JiraConnectionSettingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.JiraConnectionSettingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JiraConnectionSettingPayload>
          }
          findFirst: {
            args: Prisma.JiraConnectionSettingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JiraConnectionSettingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.JiraConnectionSettingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JiraConnectionSettingPayload>
          }
          findMany: {
            args: Prisma.JiraConnectionSettingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JiraConnectionSettingPayload>[]
          }
          create: {
            args: Prisma.JiraConnectionSettingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JiraConnectionSettingPayload>
          }
          createMany: {
            args: Prisma.JiraConnectionSettingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.JiraConnectionSettingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JiraConnectionSettingPayload>[]
          }
          delete: {
            args: Prisma.JiraConnectionSettingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JiraConnectionSettingPayload>
          }
          update: {
            args: Prisma.JiraConnectionSettingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JiraConnectionSettingPayload>
          }
          deleteMany: {
            args: Prisma.JiraConnectionSettingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.JiraConnectionSettingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.JiraConnectionSettingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JiraConnectionSettingPayload>[]
          }
          upsert: {
            args: Prisma.JiraConnectionSettingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JiraConnectionSettingPayload>
          }
          aggregate: {
            args: Prisma.JiraConnectionSettingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateJiraConnectionSetting>
          }
          groupBy: {
            args: Prisma.JiraConnectionSettingGroupByArgs<ExtArgs>
            result: $Utils.Optional<JiraConnectionSettingGroupByOutputType>[]
          }
          count: {
            args: Prisma.JiraConnectionSettingCountArgs<ExtArgs>
            result: $Utils.Optional<JiraConnectionSettingCountAggregateOutputType> | number
          }
        }
      }
      JiraPageConfig: {
        payload: Prisma.$JiraPageConfigPayload<ExtArgs>
        fields: Prisma.JiraPageConfigFieldRefs
        operations: {
          findUnique: {
            args: Prisma.JiraPageConfigFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JiraPageConfigPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.JiraPageConfigFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JiraPageConfigPayload>
          }
          findFirst: {
            args: Prisma.JiraPageConfigFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JiraPageConfigPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.JiraPageConfigFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JiraPageConfigPayload>
          }
          findMany: {
            args: Prisma.JiraPageConfigFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JiraPageConfigPayload>[]
          }
          create: {
            args: Prisma.JiraPageConfigCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JiraPageConfigPayload>
          }
          createMany: {
            args: Prisma.JiraPageConfigCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.JiraPageConfigCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JiraPageConfigPayload>[]
          }
          delete: {
            args: Prisma.JiraPageConfigDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JiraPageConfigPayload>
          }
          update: {
            args: Prisma.JiraPageConfigUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JiraPageConfigPayload>
          }
          deleteMany: {
            args: Prisma.JiraPageConfigDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.JiraPageConfigUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.JiraPageConfigUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JiraPageConfigPayload>[]
          }
          upsert: {
            args: Prisma.JiraPageConfigUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JiraPageConfigPayload>
          }
          aggregate: {
            args: Prisma.JiraPageConfigAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateJiraPageConfig>
          }
          groupBy: {
            args: Prisma.JiraPageConfigGroupByArgs<ExtArgs>
            result: $Utils.Optional<JiraPageConfigGroupByOutputType>[]
          }
          count: {
            args: Prisma.JiraPageConfigCountArgs<ExtArgs>
            result: $Utils.Optional<JiraPageConfigCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    jiraConnectionSetting?: JiraConnectionSettingOmit
    jiraPageConfig?: JiraPageConfigOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    username: string | null
    hashedPassword: string | null
    role: $Enums.UserRole | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    username: string | null
    hashedPassword: string | null
    role: $Enums.UserRole | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    username: number
    hashedPassword: number
    role: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    username?: true
    hashedPassword?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    username?: true
    hashedPassword?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    username?: true
    hashedPassword?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    username: string
    hashedPassword: string
    role: $Enums.UserRole
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    hashedPassword?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    hashedPassword?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    hashedPassword?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    username?: boolean
    hashedPassword?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "username" | "hashedPassword" | "role" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      username: string
      hashedPassword: string
      role: $Enums.UserRole
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly username: FieldRef<"User", 'String'>
    readonly hashedPassword: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'UserRole'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
  }


  /**
   * Model JiraConnectionSetting
   */

  export type AggregateJiraConnectionSetting = {
    _count: JiraConnectionSettingCountAggregateOutputType | null
    _min: JiraConnectionSettingMinAggregateOutputType | null
    _max: JiraConnectionSettingMaxAggregateOutputType | null
  }

  export type JiraConnectionSettingMinAggregateOutputType = {
    id: string | null
    baseUrl: string | null
    email: string | null
    apiToken: string | null
    updatedAt: Date | null
  }

  export type JiraConnectionSettingMaxAggregateOutputType = {
    id: string | null
    baseUrl: string | null
    email: string | null
    apiToken: string | null
    updatedAt: Date | null
  }

  export type JiraConnectionSettingCountAggregateOutputType = {
    id: number
    baseUrl: number
    email: number
    apiToken: number
    updatedAt: number
    _all: number
  }


  export type JiraConnectionSettingMinAggregateInputType = {
    id?: true
    baseUrl?: true
    email?: true
    apiToken?: true
    updatedAt?: true
  }

  export type JiraConnectionSettingMaxAggregateInputType = {
    id?: true
    baseUrl?: true
    email?: true
    apiToken?: true
    updatedAt?: true
  }

  export type JiraConnectionSettingCountAggregateInputType = {
    id?: true
    baseUrl?: true
    email?: true
    apiToken?: true
    updatedAt?: true
    _all?: true
  }

  export type JiraConnectionSettingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which JiraConnectionSetting to aggregate.
     */
    where?: JiraConnectionSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JiraConnectionSettings to fetch.
     */
    orderBy?: JiraConnectionSettingOrderByWithRelationInput | JiraConnectionSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: JiraConnectionSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JiraConnectionSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JiraConnectionSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned JiraConnectionSettings
    **/
    _count?: true | JiraConnectionSettingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: JiraConnectionSettingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: JiraConnectionSettingMaxAggregateInputType
  }

  export type GetJiraConnectionSettingAggregateType<T extends JiraConnectionSettingAggregateArgs> = {
        [P in keyof T & keyof AggregateJiraConnectionSetting]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateJiraConnectionSetting[P]>
      : GetScalarType<T[P], AggregateJiraConnectionSetting[P]>
  }




  export type JiraConnectionSettingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JiraConnectionSettingWhereInput
    orderBy?: JiraConnectionSettingOrderByWithAggregationInput | JiraConnectionSettingOrderByWithAggregationInput[]
    by: JiraConnectionSettingScalarFieldEnum[] | JiraConnectionSettingScalarFieldEnum
    having?: JiraConnectionSettingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: JiraConnectionSettingCountAggregateInputType | true
    _min?: JiraConnectionSettingMinAggregateInputType
    _max?: JiraConnectionSettingMaxAggregateInputType
  }

  export type JiraConnectionSettingGroupByOutputType = {
    id: string
    baseUrl: string | null
    email: string | null
    apiToken: string | null
    updatedAt: Date
    _count: JiraConnectionSettingCountAggregateOutputType | null
    _min: JiraConnectionSettingMinAggregateOutputType | null
    _max: JiraConnectionSettingMaxAggregateOutputType | null
  }

  type GetJiraConnectionSettingGroupByPayload<T extends JiraConnectionSettingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<JiraConnectionSettingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof JiraConnectionSettingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], JiraConnectionSettingGroupByOutputType[P]>
            : GetScalarType<T[P], JiraConnectionSettingGroupByOutputType[P]>
        }
      >
    >


  export type JiraConnectionSettingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    baseUrl?: boolean
    email?: boolean
    apiToken?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["jiraConnectionSetting"]>

  export type JiraConnectionSettingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    baseUrl?: boolean
    email?: boolean
    apiToken?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["jiraConnectionSetting"]>

  export type JiraConnectionSettingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    baseUrl?: boolean
    email?: boolean
    apiToken?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["jiraConnectionSetting"]>

  export type JiraConnectionSettingSelectScalar = {
    id?: boolean
    baseUrl?: boolean
    email?: boolean
    apiToken?: boolean
    updatedAt?: boolean
  }

  export type JiraConnectionSettingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "baseUrl" | "email" | "apiToken" | "updatedAt", ExtArgs["result"]["jiraConnectionSetting"]>

  export type $JiraConnectionSettingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "JiraConnectionSetting"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      baseUrl: string | null
      email: string | null
      apiToken: string | null
      updatedAt: Date
    }, ExtArgs["result"]["jiraConnectionSetting"]>
    composites: {}
  }

  type JiraConnectionSettingGetPayload<S extends boolean | null | undefined | JiraConnectionSettingDefaultArgs> = $Result.GetResult<Prisma.$JiraConnectionSettingPayload, S>

  type JiraConnectionSettingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<JiraConnectionSettingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: JiraConnectionSettingCountAggregateInputType | true
    }

  export interface JiraConnectionSettingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['JiraConnectionSetting'], meta: { name: 'JiraConnectionSetting' } }
    /**
     * Find zero or one JiraConnectionSetting that matches the filter.
     * @param {JiraConnectionSettingFindUniqueArgs} args - Arguments to find a JiraConnectionSetting
     * @example
     * // Get one JiraConnectionSetting
     * const jiraConnectionSetting = await prisma.jiraConnectionSetting.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends JiraConnectionSettingFindUniqueArgs>(args: SelectSubset<T, JiraConnectionSettingFindUniqueArgs<ExtArgs>>): Prisma__JiraConnectionSettingClient<$Result.GetResult<Prisma.$JiraConnectionSettingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one JiraConnectionSetting that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {JiraConnectionSettingFindUniqueOrThrowArgs} args - Arguments to find a JiraConnectionSetting
     * @example
     * // Get one JiraConnectionSetting
     * const jiraConnectionSetting = await prisma.jiraConnectionSetting.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends JiraConnectionSettingFindUniqueOrThrowArgs>(args: SelectSubset<T, JiraConnectionSettingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__JiraConnectionSettingClient<$Result.GetResult<Prisma.$JiraConnectionSettingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first JiraConnectionSetting that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JiraConnectionSettingFindFirstArgs} args - Arguments to find a JiraConnectionSetting
     * @example
     * // Get one JiraConnectionSetting
     * const jiraConnectionSetting = await prisma.jiraConnectionSetting.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends JiraConnectionSettingFindFirstArgs>(args?: SelectSubset<T, JiraConnectionSettingFindFirstArgs<ExtArgs>>): Prisma__JiraConnectionSettingClient<$Result.GetResult<Prisma.$JiraConnectionSettingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first JiraConnectionSetting that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JiraConnectionSettingFindFirstOrThrowArgs} args - Arguments to find a JiraConnectionSetting
     * @example
     * // Get one JiraConnectionSetting
     * const jiraConnectionSetting = await prisma.jiraConnectionSetting.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends JiraConnectionSettingFindFirstOrThrowArgs>(args?: SelectSubset<T, JiraConnectionSettingFindFirstOrThrowArgs<ExtArgs>>): Prisma__JiraConnectionSettingClient<$Result.GetResult<Prisma.$JiraConnectionSettingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more JiraConnectionSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JiraConnectionSettingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all JiraConnectionSettings
     * const jiraConnectionSettings = await prisma.jiraConnectionSetting.findMany()
     * 
     * // Get first 10 JiraConnectionSettings
     * const jiraConnectionSettings = await prisma.jiraConnectionSetting.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const jiraConnectionSettingWithIdOnly = await prisma.jiraConnectionSetting.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends JiraConnectionSettingFindManyArgs>(args?: SelectSubset<T, JiraConnectionSettingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JiraConnectionSettingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a JiraConnectionSetting.
     * @param {JiraConnectionSettingCreateArgs} args - Arguments to create a JiraConnectionSetting.
     * @example
     * // Create one JiraConnectionSetting
     * const JiraConnectionSetting = await prisma.jiraConnectionSetting.create({
     *   data: {
     *     // ... data to create a JiraConnectionSetting
     *   }
     * })
     * 
     */
    create<T extends JiraConnectionSettingCreateArgs>(args: SelectSubset<T, JiraConnectionSettingCreateArgs<ExtArgs>>): Prisma__JiraConnectionSettingClient<$Result.GetResult<Prisma.$JiraConnectionSettingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many JiraConnectionSettings.
     * @param {JiraConnectionSettingCreateManyArgs} args - Arguments to create many JiraConnectionSettings.
     * @example
     * // Create many JiraConnectionSettings
     * const jiraConnectionSetting = await prisma.jiraConnectionSetting.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends JiraConnectionSettingCreateManyArgs>(args?: SelectSubset<T, JiraConnectionSettingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many JiraConnectionSettings and returns the data saved in the database.
     * @param {JiraConnectionSettingCreateManyAndReturnArgs} args - Arguments to create many JiraConnectionSettings.
     * @example
     * // Create many JiraConnectionSettings
     * const jiraConnectionSetting = await prisma.jiraConnectionSetting.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many JiraConnectionSettings and only return the `id`
     * const jiraConnectionSettingWithIdOnly = await prisma.jiraConnectionSetting.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends JiraConnectionSettingCreateManyAndReturnArgs>(args?: SelectSubset<T, JiraConnectionSettingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JiraConnectionSettingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a JiraConnectionSetting.
     * @param {JiraConnectionSettingDeleteArgs} args - Arguments to delete one JiraConnectionSetting.
     * @example
     * // Delete one JiraConnectionSetting
     * const JiraConnectionSetting = await prisma.jiraConnectionSetting.delete({
     *   where: {
     *     // ... filter to delete one JiraConnectionSetting
     *   }
     * })
     * 
     */
    delete<T extends JiraConnectionSettingDeleteArgs>(args: SelectSubset<T, JiraConnectionSettingDeleteArgs<ExtArgs>>): Prisma__JiraConnectionSettingClient<$Result.GetResult<Prisma.$JiraConnectionSettingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one JiraConnectionSetting.
     * @param {JiraConnectionSettingUpdateArgs} args - Arguments to update one JiraConnectionSetting.
     * @example
     * // Update one JiraConnectionSetting
     * const jiraConnectionSetting = await prisma.jiraConnectionSetting.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends JiraConnectionSettingUpdateArgs>(args: SelectSubset<T, JiraConnectionSettingUpdateArgs<ExtArgs>>): Prisma__JiraConnectionSettingClient<$Result.GetResult<Prisma.$JiraConnectionSettingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more JiraConnectionSettings.
     * @param {JiraConnectionSettingDeleteManyArgs} args - Arguments to filter JiraConnectionSettings to delete.
     * @example
     * // Delete a few JiraConnectionSettings
     * const { count } = await prisma.jiraConnectionSetting.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends JiraConnectionSettingDeleteManyArgs>(args?: SelectSubset<T, JiraConnectionSettingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more JiraConnectionSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JiraConnectionSettingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many JiraConnectionSettings
     * const jiraConnectionSetting = await prisma.jiraConnectionSetting.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends JiraConnectionSettingUpdateManyArgs>(args: SelectSubset<T, JiraConnectionSettingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more JiraConnectionSettings and returns the data updated in the database.
     * @param {JiraConnectionSettingUpdateManyAndReturnArgs} args - Arguments to update many JiraConnectionSettings.
     * @example
     * // Update many JiraConnectionSettings
     * const jiraConnectionSetting = await prisma.jiraConnectionSetting.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more JiraConnectionSettings and only return the `id`
     * const jiraConnectionSettingWithIdOnly = await prisma.jiraConnectionSetting.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends JiraConnectionSettingUpdateManyAndReturnArgs>(args: SelectSubset<T, JiraConnectionSettingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JiraConnectionSettingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one JiraConnectionSetting.
     * @param {JiraConnectionSettingUpsertArgs} args - Arguments to update or create a JiraConnectionSetting.
     * @example
     * // Update or create a JiraConnectionSetting
     * const jiraConnectionSetting = await prisma.jiraConnectionSetting.upsert({
     *   create: {
     *     // ... data to create a JiraConnectionSetting
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the JiraConnectionSetting we want to update
     *   }
     * })
     */
    upsert<T extends JiraConnectionSettingUpsertArgs>(args: SelectSubset<T, JiraConnectionSettingUpsertArgs<ExtArgs>>): Prisma__JiraConnectionSettingClient<$Result.GetResult<Prisma.$JiraConnectionSettingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of JiraConnectionSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JiraConnectionSettingCountArgs} args - Arguments to filter JiraConnectionSettings to count.
     * @example
     * // Count the number of JiraConnectionSettings
     * const count = await prisma.jiraConnectionSetting.count({
     *   where: {
     *     // ... the filter for the JiraConnectionSettings we want to count
     *   }
     * })
    **/
    count<T extends JiraConnectionSettingCountArgs>(
      args?: Subset<T, JiraConnectionSettingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], JiraConnectionSettingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a JiraConnectionSetting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JiraConnectionSettingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends JiraConnectionSettingAggregateArgs>(args: Subset<T, JiraConnectionSettingAggregateArgs>): Prisma.PrismaPromise<GetJiraConnectionSettingAggregateType<T>>

    /**
     * Group by JiraConnectionSetting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JiraConnectionSettingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends JiraConnectionSettingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: JiraConnectionSettingGroupByArgs['orderBy'] }
        : { orderBy?: JiraConnectionSettingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, JiraConnectionSettingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetJiraConnectionSettingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the JiraConnectionSetting model
   */
  readonly fields: JiraConnectionSettingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for JiraConnectionSetting.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__JiraConnectionSettingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the JiraConnectionSetting model
   */
  interface JiraConnectionSettingFieldRefs {
    readonly id: FieldRef<"JiraConnectionSetting", 'String'>
    readonly baseUrl: FieldRef<"JiraConnectionSetting", 'String'>
    readonly email: FieldRef<"JiraConnectionSetting", 'String'>
    readonly apiToken: FieldRef<"JiraConnectionSetting", 'String'>
    readonly updatedAt: FieldRef<"JiraConnectionSetting", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * JiraConnectionSetting findUnique
   */
  export type JiraConnectionSettingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JiraConnectionSetting
     */
    select?: JiraConnectionSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JiraConnectionSetting
     */
    omit?: JiraConnectionSettingOmit<ExtArgs> | null
    /**
     * Filter, which JiraConnectionSetting to fetch.
     */
    where: JiraConnectionSettingWhereUniqueInput
  }

  /**
   * JiraConnectionSetting findUniqueOrThrow
   */
  export type JiraConnectionSettingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JiraConnectionSetting
     */
    select?: JiraConnectionSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JiraConnectionSetting
     */
    omit?: JiraConnectionSettingOmit<ExtArgs> | null
    /**
     * Filter, which JiraConnectionSetting to fetch.
     */
    where: JiraConnectionSettingWhereUniqueInput
  }

  /**
   * JiraConnectionSetting findFirst
   */
  export type JiraConnectionSettingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JiraConnectionSetting
     */
    select?: JiraConnectionSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JiraConnectionSetting
     */
    omit?: JiraConnectionSettingOmit<ExtArgs> | null
    /**
     * Filter, which JiraConnectionSetting to fetch.
     */
    where?: JiraConnectionSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JiraConnectionSettings to fetch.
     */
    orderBy?: JiraConnectionSettingOrderByWithRelationInput | JiraConnectionSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for JiraConnectionSettings.
     */
    cursor?: JiraConnectionSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JiraConnectionSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JiraConnectionSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of JiraConnectionSettings.
     */
    distinct?: JiraConnectionSettingScalarFieldEnum | JiraConnectionSettingScalarFieldEnum[]
  }

  /**
   * JiraConnectionSetting findFirstOrThrow
   */
  export type JiraConnectionSettingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JiraConnectionSetting
     */
    select?: JiraConnectionSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JiraConnectionSetting
     */
    omit?: JiraConnectionSettingOmit<ExtArgs> | null
    /**
     * Filter, which JiraConnectionSetting to fetch.
     */
    where?: JiraConnectionSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JiraConnectionSettings to fetch.
     */
    orderBy?: JiraConnectionSettingOrderByWithRelationInput | JiraConnectionSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for JiraConnectionSettings.
     */
    cursor?: JiraConnectionSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JiraConnectionSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JiraConnectionSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of JiraConnectionSettings.
     */
    distinct?: JiraConnectionSettingScalarFieldEnum | JiraConnectionSettingScalarFieldEnum[]
  }

  /**
   * JiraConnectionSetting findMany
   */
  export type JiraConnectionSettingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JiraConnectionSetting
     */
    select?: JiraConnectionSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JiraConnectionSetting
     */
    omit?: JiraConnectionSettingOmit<ExtArgs> | null
    /**
     * Filter, which JiraConnectionSettings to fetch.
     */
    where?: JiraConnectionSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JiraConnectionSettings to fetch.
     */
    orderBy?: JiraConnectionSettingOrderByWithRelationInput | JiraConnectionSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing JiraConnectionSettings.
     */
    cursor?: JiraConnectionSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JiraConnectionSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JiraConnectionSettings.
     */
    skip?: number
    distinct?: JiraConnectionSettingScalarFieldEnum | JiraConnectionSettingScalarFieldEnum[]
  }

  /**
   * JiraConnectionSetting create
   */
  export type JiraConnectionSettingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JiraConnectionSetting
     */
    select?: JiraConnectionSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JiraConnectionSetting
     */
    omit?: JiraConnectionSettingOmit<ExtArgs> | null
    /**
     * The data needed to create a JiraConnectionSetting.
     */
    data: XOR<JiraConnectionSettingCreateInput, JiraConnectionSettingUncheckedCreateInput>
  }

  /**
   * JiraConnectionSetting createMany
   */
  export type JiraConnectionSettingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many JiraConnectionSettings.
     */
    data: JiraConnectionSettingCreateManyInput | JiraConnectionSettingCreateManyInput[]
  }

  /**
   * JiraConnectionSetting createManyAndReturn
   */
  export type JiraConnectionSettingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JiraConnectionSetting
     */
    select?: JiraConnectionSettingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the JiraConnectionSetting
     */
    omit?: JiraConnectionSettingOmit<ExtArgs> | null
    /**
     * The data used to create many JiraConnectionSettings.
     */
    data: JiraConnectionSettingCreateManyInput | JiraConnectionSettingCreateManyInput[]
  }

  /**
   * JiraConnectionSetting update
   */
  export type JiraConnectionSettingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JiraConnectionSetting
     */
    select?: JiraConnectionSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JiraConnectionSetting
     */
    omit?: JiraConnectionSettingOmit<ExtArgs> | null
    /**
     * The data needed to update a JiraConnectionSetting.
     */
    data: XOR<JiraConnectionSettingUpdateInput, JiraConnectionSettingUncheckedUpdateInput>
    /**
     * Choose, which JiraConnectionSetting to update.
     */
    where: JiraConnectionSettingWhereUniqueInput
  }

  /**
   * JiraConnectionSetting updateMany
   */
  export type JiraConnectionSettingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update JiraConnectionSettings.
     */
    data: XOR<JiraConnectionSettingUpdateManyMutationInput, JiraConnectionSettingUncheckedUpdateManyInput>
    /**
     * Filter which JiraConnectionSettings to update
     */
    where?: JiraConnectionSettingWhereInput
    /**
     * Limit how many JiraConnectionSettings to update.
     */
    limit?: number
  }

  /**
   * JiraConnectionSetting updateManyAndReturn
   */
  export type JiraConnectionSettingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JiraConnectionSetting
     */
    select?: JiraConnectionSettingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the JiraConnectionSetting
     */
    omit?: JiraConnectionSettingOmit<ExtArgs> | null
    /**
     * The data used to update JiraConnectionSettings.
     */
    data: XOR<JiraConnectionSettingUpdateManyMutationInput, JiraConnectionSettingUncheckedUpdateManyInput>
    /**
     * Filter which JiraConnectionSettings to update
     */
    where?: JiraConnectionSettingWhereInput
    /**
     * Limit how many JiraConnectionSettings to update.
     */
    limit?: number
  }

  /**
   * JiraConnectionSetting upsert
   */
  export type JiraConnectionSettingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JiraConnectionSetting
     */
    select?: JiraConnectionSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JiraConnectionSetting
     */
    omit?: JiraConnectionSettingOmit<ExtArgs> | null
    /**
     * The filter to search for the JiraConnectionSetting to update in case it exists.
     */
    where: JiraConnectionSettingWhereUniqueInput
    /**
     * In case the JiraConnectionSetting found by the `where` argument doesn't exist, create a new JiraConnectionSetting with this data.
     */
    create: XOR<JiraConnectionSettingCreateInput, JiraConnectionSettingUncheckedCreateInput>
    /**
     * In case the JiraConnectionSetting was found with the provided `where` argument, update it with this data.
     */
    update: XOR<JiraConnectionSettingUpdateInput, JiraConnectionSettingUncheckedUpdateInput>
  }

  /**
   * JiraConnectionSetting delete
   */
  export type JiraConnectionSettingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JiraConnectionSetting
     */
    select?: JiraConnectionSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JiraConnectionSetting
     */
    omit?: JiraConnectionSettingOmit<ExtArgs> | null
    /**
     * Filter which JiraConnectionSetting to delete.
     */
    where: JiraConnectionSettingWhereUniqueInput
  }

  /**
   * JiraConnectionSetting deleteMany
   */
  export type JiraConnectionSettingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which JiraConnectionSettings to delete
     */
    where?: JiraConnectionSettingWhereInput
    /**
     * Limit how many JiraConnectionSettings to delete.
     */
    limit?: number
  }

  /**
   * JiraConnectionSetting without action
   */
  export type JiraConnectionSettingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JiraConnectionSetting
     */
    select?: JiraConnectionSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JiraConnectionSetting
     */
    omit?: JiraConnectionSettingOmit<ExtArgs> | null
  }


  /**
   * Model JiraPageConfig
   */

  export type AggregateJiraPageConfig = {
    _count: JiraPageConfigCountAggregateOutputType | null
    _min: JiraPageConfigMinAggregateOutputType | null
    _max: JiraPageConfigMaxAggregateOutputType | null
  }

  export type JiraPageConfigMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    jql: string | null
    type: string | null
    columns: string | null
    sortBy: string | null
    sortOrder: string | null
    ownerId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type JiraPageConfigMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    jql: string | null
    type: string | null
    columns: string | null
    sortBy: string | null
    sortOrder: string | null
    ownerId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type JiraPageConfigCountAggregateOutputType = {
    id: number
    title: number
    description: number
    jql: number
    type: number
    columns: number
    sortBy: number
    sortOrder: number
    ownerId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type JiraPageConfigMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    jql?: true
    type?: true
    columns?: true
    sortBy?: true
    sortOrder?: true
    ownerId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type JiraPageConfigMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    jql?: true
    type?: true
    columns?: true
    sortBy?: true
    sortOrder?: true
    ownerId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type JiraPageConfigCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    jql?: true
    type?: true
    columns?: true
    sortBy?: true
    sortOrder?: true
    ownerId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type JiraPageConfigAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which JiraPageConfig to aggregate.
     */
    where?: JiraPageConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JiraPageConfigs to fetch.
     */
    orderBy?: JiraPageConfigOrderByWithRelationInput | JiraPageConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: JiraPageConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JiraPageConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JiraPageConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned JiraPageConfigs
    **/
    _count?: true | JiraPageConfigCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: JiraPageConfigMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: JiraPageConfigMaxAggregateInputType
  }

  export type GetJiraPageConfigAggregateType<T extends JiraPageConfigAggregateArgs> = {
        [P in keyof T & keyof AggregateJiraPageConfig]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateJiraPageConfig[P]>
      : GetScalarType<T[P], AggregateJiraPageConfig[P]>
  }




  export type JiraPageConfigGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JiraPageConfigWhereInput
    orderBy?: JiraPageConfigOrderByWithAggregationInput | JiraPageConfigOrderByWithAggregationInput[]
    by: JiraPageConfigScalarFieldEnum[] | JiraPageConfigScalarFieldEnum
    having?: JiraPageConfigScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: JiraPageConfigCountAggregateInputType | true
    _min?: JiraPageConfigMinAggregateInputType
    _max?: JiraPageConfigMaxAggregateInputType
  }

  export type JiraPageConfigGroupByOutputType = {
    id: string
    title: string
    description: string | null
    jql: string
    type: string
    columns: string | null
    sortBy: string | null
    sortOrder: string | null
    ownerId: string | null
    createdAt: Date
    updatedAt: Date
    _count: JiraPageConfigCountAggregateOutputType | null
    _min: JiraPageConfigMinAggregateOutputType | null
    _max: JiraPageConfigMaxAggregateOutputType | null
  }

  type GetJiraPageConfigGroupByPayload<T extends JiraPageConfigGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<JiraPageConfigGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof JiraPageConfigGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], JiraPageConfigGroupByOutputType[P]>
            : GetScalarType<T[P], JiraPageConfigGroupByOutputType[P]>
        }
      >
    >


  export type JiraPageConfigSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    jql?: boolean
    type?: boolean
    columns?: boolean
    sortBy?: boolean
    sortOrder?: boolean
    ownerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["jiraPageConfig"]>

  export type JiraPageConfigSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    jql?: boolean
    type?: boolean
    columns?: boolean
    sortBy?: boolean
    sortOrder?: boolean
    ownerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["jiraPageConfig"]>

  export type JiraPageConfigSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    jql?: boolean
    type?: boolean
    columns?: boolean
    sortBy?: boolean
    sortOrder?: boolean
    ownerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["jiraPageConfig"]>

  export type JiraPageConfigSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    jql?: boolean
    type?: boolean
    columns?: boolean
    sortBy?: boolean
    sortOrder?: boolean
    ownerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type JiraPageConfigOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "description" | "jql" | "type" | "columns" | "sortBy" | "sortOrder" | "ownerId" | "createdAt" | "updatedAt", ExtArgs["result"]["jiraPageConfig"]>

  export type $JiraPageConfigPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "JiraPageConfig"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string | null
      jql: string
      type: string
      columns: string | null
      sortBy: string | null
      sortOrder: string | null
      ownerId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["jiraPageConfig"]>
    composites: {}
  }

  type JiraPageConfigGetPayload<S extends boolean | null | undefined | JiraPageConfigDefaultArgs> = $Result.GetResult<Prisma.$JiraPageConfigPayload, S>

  type JiraPageConfigCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<JiraPageConfigFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: JiraPageConfigCountAggregateInputType | true
    }

  export interface JiraPageConfigDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['JiraPageConfig'], meta: { name: 'JiraPageConfig' } }
    /**
     * Find zero or one JiraPageConfig that matches the filter.
     * @param {JiraPageConfigFindUniqueArgs} args - Arguments to find a JiraPageConfig
     * @example
     * // Get one JiraPageConfig
     * const jiraPageConfig = await prisma.jiraPageConfig.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends JiraPageConfigFindUniqueArgs>(args: SelectSubset<T, JiraPageConfigFindUniqueArgs<ExtArgs>>): Prisma__JiraPageConfigClient<$Result.GetResult<Prisma.$JiraPageConfigPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one JiraPageConfig that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {JiraPageConfigFindUniqueOrThrowArgs} args - Arguments to find a JiraPageConfig
     * @example
     * // Get one JiraPageConfig
     * const jiraPageConfig = await prisma.jiraPageConfig.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends JiraPageConfigFindUniqueOrThrowArgs>(args: SelectSubset<T, JiraPageConfigFindUniqueOrThrowArgs<ExtArgs>>): Prisma__JiraPageConfigClient<$Result.GetResult<Prisma.$JiraPageConfigPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first JiraPageConfig that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JiraPageConfigFindFirstArgs} args - Arguments to find a JiraPageConfig
     * @example
     * // Get one JiraPageConfig
     * const jiraPageConfig = await prisma.jiraPageConfig.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends JiraPageConfigFindFirstArgs>(args?: SelectSubset<T, JiraPageConfigFindFirstArgs<ExtArgs>>): Prisma__JiraPageConfigClient<$Result.GetResult<Prisma.$JiraPageConfigPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first JiraPageConfig that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JiraPageConfigFindFirstOrThrowArgs} args - Arguments to find a JiraPageConfig
     * @example
     * // Get one JiraPageConfig
     * const jiraPageConfig = await prisma.jiraPageConfig.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends JiraPageConfigFindFirstOrThrowArgs>(args?: SelectSubset<T, JiraPageConfigFindFirstOrThrowArgs<ExtArgs>>): Prisma__JiraPageConfigClient<$Result.GetResult<Prisma.$JiraPageConfigPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more JiraPageConfigs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JiraPageConfigFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all JiraPageConfigs
     * const jiraPageConfigs = await prisma.jiraPageConfig.findMany()
     * 
     * // Get first 10 JiraPageConfigs
     * const jiraPageConfigs = await prisma.jiraPageConfig.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const jiraPageConfigWithIdOnly = await prisma.jiraPageConfig.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends JiraPageConfigFindManyArgs>(args?: SelectSubset<T, JiraPageConfigFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JiraPageConfigPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a JiraPageConfig.
     * @param {JiraPageConfigCreateArgs} args - Arguments to create a JiraPageConfig.
     * @example
     * // Create one JiraPageConfig
     * const JiraPageConfig = await prisma.jiraPageConfig.create({
     *   data: {
     *     // ... data to create a JiraPageConfig
     *   }
     * })
     * 
     */
    create<T extends JiraPageConfigCreateArgs>(args: SelectSubset<T, JiraPageConfigCreateArgs<ExtArgs>>): Prisma__JiraPageConfigClient<$Result.GetResult<Prisma.$JiraPageConfigPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many JiraPageConfigs.
     * @param {JiraPageConfigCreateManyArgs} args - Arguments to create many JiraPageConfigs.
     * @example
     * // Create many JiraPageConfigs
     * const jiraPageConfig = await prisma.jiraPageConfig.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends JiraPageConfigCreateManyArgs>(args?: SelectSubset<T, JiraPageConfigCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many JiraPageConfigs and returns the data saved in the database.
     * @param {JiraPageConfigCreateManyAndReturnArgs} args - Arguments to create many JiraPageConfigs.
     * @example
     * // Create many JiraPageConfigs
     * const jiraPageConfig = await prisma.jiraPageConfig.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many JiraPageConfigs and only return the `id`
     * const jiraPageConfigWithIdOnly = await prisma.jiraPageConfig.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends JiraPageConfigCreateManyAndReturnArgs>(args?: SelectSubset<T, JiraPageConfigCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JiraPageConfigPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a JiraPageConfig.
     * @param {JiraPageConfigDeleteArgs} args - Arguments to delete one JiraPageConfig.
     * @example
     * // Delete one JiraPageConfig
     * const JiraPageConfig = await prisma.jiraPageConfig.delete({
     *   where: {
     *     // ... filter to delete one JiraPageConfig
     *   }
     * })
     * 
     */
    delete<T extends JiraPageConfigDeleteArgs>(args: SelectSubset<T, JiraPageConfigDeleteArgs<ExtArgs>>): Prisma__JiraPageConfigClient<$Result.GetResult<Prisma.$JiraPageConfigPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one JiraPageConfig.
     * @param {JiraPageConfigUpdateArgs} args - Arguments to update one JiraPageConfig.
     * @example
     * // Update one JiraPageConfig
     * const jiraPageConfig = await prisma.jiraPageConfig.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends JiraPageConfigUpdateArgs>(args: SelectSubset<T, JiraPageConfigUpdateArgs<ExtArgs>>): Prisma__JiraPageConfigClient<$Result.GetResult<Prisma.$JiraPageConfigPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more JiraPageConfigs.
     * @param {JiraPageConfigDeleteManyArgs} args - Arguments to filter JiraPageConfigs to delete.
     * @example
     * // Delete a few JiraPageConfigs
     * const { count } = await prisma.jiraPageConfig.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends JiraPageConfigDeleteManyArgs>(args?: SelectSubset<T, JiraPageConfigDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more JiraPageConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JiraPageConfigUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many JiraPageConfigs
     * const jiraPageConfig = await prisma.jiraPageConfig.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends JiraPageConfigUpdateManyArgs>(args: SelectSubset<T, JiraPageConfigUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more JiraPageConfigs and returns the data updated in the database.
     * @param {JiraPageConfigUpdateManyAndReturnArgs} args - Arguments to update many JiraPageConfigs.
     * @example
     * // Update many JiraPageConfigs
     * const jiraPageConfig = await prisma.jiraPageConfig.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more JiraPageConfigs and only return the `id`
     * const jiraPageConfigWithIdOnly = await prisma.jiraPageConfig.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends JiraPageConfigUpdateManyAndReturnArgs>(args: SelectSubset<T, JiraPageConfigUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JiraPageConfigPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one JiraPageConfig.
     * @param {JiraPageConfigUpsertArgs} args - Arguments to update or create a JiraPageConfig.
     * @example
     * // Update or create a JiraPageConfig
     * const jiraPageConfig = await prisma.jiraPageConfig.upsert({
     *   create: {
     *     // ... data to create a JiraPageConfig
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the JiraPageConfig we want to update
     *   }
     * })
     */
    upsert<T extends JiraPageConfigUpsertArgs>(args: SelectSubset<T, JiraPageConfigUpsertArgs<ExtArgs>>): Prisma__JiraPageConfigClient<$Result.GetResult<Prisma.$JiraPageConfigPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of JiraPageConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JiraPageConfigCountArgs} args - Arguments to filter JiraPageConfigs to count.
     * @example
     * // Count the number of JiraPageConfigs
     * const count = await prisma.jiraPageConfig.count({
     *   where: {
     *     // ... the filter for the JiraPageConfigs we want to count
     *   }
     * })
    **/
    count<T extends JiraPageConfigCountArgs>(
      args?: Subset<T, JiraPageConfigCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], JiraPageConfigCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a JiraPageConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JiraPageConfigAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends JiraPageConfigAggregateArgs>(args: Subset<T, JiraPageConfigAggregateArgs>): Prisma.PrismaPromise<GetJiraPageConfigAggregateType<T>>

    /**
     * Group by JiraPageConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JiraPageConfigGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends JiraPageConfigGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: JiraPageConfigGroupByArgs['orderBy'] }
        : { orderBy?: JiraPageConfigGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, JiraPageConfigGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetJiraPageConfigGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the JiraPageConfig model
   */
  readonly fields: JiraPageConfigFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for JiraPageConfig.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__JiraPageConfigClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the JiraPageConfig model
   */
  interface JiraPageConfigFieldRefs {
    readonly id: FieldRef<"JiraPageConfig", 'String'>
    readonly title: FieldRef<"JiraPageConfig", 'String'>
    readonly description: FieldRef<"JiraPageConfig", 'String'>
    readonly jql: FieldRef<"JiraPageConfig", 'String'>
    readonly type: FieldRef<"JiraPageConfig", 'String'>
    readonly columns: FieldRef<"JiraPageConfig", 'String'>
    readonly sortBy: FieldRef<"JiraPageConfig", 'String'>
    readonly sortOrder: FieldRef<"JiraPageConfig", 'String'>
    readonly ownerId: FieldRef<"JiraPageConfig", 'String'>
    readonly createdAt: FieldRef<"JiraPageConfig", 'DateTime'>
    readonly updatedAt: FieldRef<"JiraPageConfig", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * JiraPageConfig findUnique
   */
  export type JiraPageConfigFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JiraPageConfig
     */
    select?: JiraPageConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JiraPageConfig
     */
    omit?: JiraPageConfigOmit<ExtArgs> | null
    /**
     * Filter, which JiraPageConfig to fetch.
     */
    where: JiraPageConfigWhereUniqueInput
  }

  /**
   * JiraPageConfig findUniqueOrThrow
   */
  export type JiraPageConfigFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JiraPageConfig
     */
    select?: JiraPageConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JiraPageConfig
     */
    omit?: JiraPageConfigOmit<ExtArgs> | null
    /**
     * Filter, which JiraPageConfig to fetch.
     */
    where: JiraPageConfigWhereUniqueInput
  }

  /**
   * JiraPageConfig findFirst
   */
  export type JiraPageConfigFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JiraPageConfig
     */
    select?: JiraPageConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JiraPageConfig
     */
    omit?: JiraPageConfigOmit<ExtArgs> | null
    /**
     * Filter, which JiraPageConfig to fetch.
     */
    where?: JiraPageConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JiraPageConfigs to fetch.
     */
    orderBy?: JiraPageConfigOrderByWithRelationInput | JiraPageConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for JiraPageConfigs.
     */
    cursor?: JiraPageConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JiraPageConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JiraPageConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of JiraPageConfigs.
     */
    distinct?: JiraPageConfigScalarFieldEnum | JiraPageConfigScalarFieldEnum[]
  }

  /**
   * JiraPageConfig findFirstOrThrow
   */
  export type JiraPageConfigFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JiraPageConfig
     */
    select?: JiraPageConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JiraPageConfig
     */
    omit?: JiraPageConfigOmit<ExtArgs> | null
    /**
     * Filter, which JiraPageConfig to fetch.
     */
    where?: JiraPageConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JiraPageConfigs to fetch.
     */
    orderBy?: JiraPageConfigOrderByWithRelationInput | JiraPageConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for JiraPageConfigs.
     */
    cursor?: JiraPageConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JiraPageConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JiraPageConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of JiraPageConfigs.
     */
    distinct?: JiraPageConfigScalarFieldEnum | JiraPageConfigScalarFieldEnum[]
  }

  /**
   * JiraPageConfig findMany
   */
  export type JiraPageConfigFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JiraPageConfig
     */
    select?: JiraPageConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JiraPageConfig
     */
    omit?: JiraPageConfigOmit<ExtArgs> | null
    /**
     * Filter, which JiraPageConfigs to fetch.
     */
    where?: JiraPageConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JiraPageConfigs to fetch.
     */
    orderBy?: JiraPageConfigOrderByWithRelationInput | JiraPageConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing JiraPageConfigs.
     */
    cursor?: JiraPageConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JiraPageConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JiraPageConfigs.
     */
    skip?: number
    distinct?: JiraPageConfigScalarFieldEnum | JiraPageConfigScalarFieldEnum[]
  }

  /**
   * JiraPageConfig create
   */
  export type JiraPageConfigCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JiraPageConfig
     */
    select?: JiraPageConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JiraPageConfig
     */
    omit?: JiraPageConfigOmit<ExtArgs> | null
    /**
     * The data needed to create a JiraPageConfig.
     */
    data: XOR<JiraPageConfigCreateInput, JiraPageConfigUncheckedCreateInput>
  }

  /**
   * JiraPageConfig createMany
   */
  export type JiraPageConfigCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many JiraPageConfigs.
     */
    data: JiraPageConfigCreateManyInput | JiraPageConfigCreateManyInput[]
  }

  /**
   * JiraPageConfig createManyAndReturn
   */
  export type JiraPageConfigCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JiraPageConfig
     */
    select?: JiraPageConfigSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the JiraPageConfig
     */
    omit?: JiraPageConfigOmit<ExtArgs> | null
    /**
     * The data used to create many JiraPageConfigs.
     */
    data: JiraPageConfigCreateManyInput | JiraPageConfigCreateManyInput[]
  }

  /**
   * JiraPageConfig update
   */
  export type JiraPageConfigUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JiraPageConfig
     */
    select?: JiraPageConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JiraPageConfig
     */
    omit?: JiraPageConfigOmit<ExtArgs> | null
    /**
     * The data needed to update a JiraPageConfig.
     */
    data: XOR<JiraPageConfigUpdateInput, JiraPageConfigUncheckedUpdateInput>
    /**
     * Choose, which JiraPageConfig to update.
     */
    where: JiraPageConfigWhereUniqueInput
  }

  /**
   * JiraPageConfig updateMany
   */
  export type JiraPageConfigUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update JiraPageConfigs.
     */
    data: XOR<JiraPageConfigUpdateManyMutationInput, JiraPageConfigUncheckedUpdateManyInput>
    /**
     * Filter which JiraPageConfigs to update
     */
    where?: JiraPageConfigWhereInput
    /**
     * Limit how many JiraPageConfigs to update.
     */
    limit?: number
  }

  /**
   * JiraPageConfig updateManyAndReturn
   */
  export type JiraPageConfigUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JiraPageConfig
     */
    select?: JiraPageConfigSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the JiraPageConfig
     */
    omit?: JiraPageConfigOmit<ExtArgs> | null
    /**
     * The data used to update JiraPageConfigs.
     */
    data: XOR<JiraPageConfigUpdateManyMutationInput, JiraPageConfigUncheckedUpdateManyInput>
    /**
     * Filter which JiraPageConfigs to update
     */
    where?: JiraPageConfigWhereInput
    /**
     * Limit how many JiraPageConfigs to update.
     */
    limit?: number
  }

  /**
   * JiraPageConfig upsert
   */
  export type JiraPageConfigUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JiraPageConfig
     */
    select?: JiraPageConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JiraPageConfig
     */
    omit?: JiraPageConfigOmit<ExtArgs> | null
    /**
     * The filter to search for the JiraPageConfig to update in case it exists.
     */
    where: JiraPageConfigWhereUniqueInput
    /**
     * In case the JiraPageConfig found by the `where` argument doesn't exist, create a new JiraPageConfig with this data.
     */
    create: XOR<JiraPageConfigCreateInput, JiraPageConfigUncheckedCreateInput>
    /**
     * In case the JiraPageConfig was found with the provided `where` argument, update it with this data.
     */
    update: XOR<JiraPageConfigUpdateInput, JiraPageConfigUncheckedUpdateInput>
  }

  /**
   * JiraPageConfig delete
   */
  export type JiraPageConfigDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JiraPageConfig
     */
    select?: JiraPageConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JiraPageConfig
     */
    omit?: JiraPageConfigOmit<ExtArgs> | null
    /**
     * Filter which JiraPageConfig to delete.
     */
    where: JiraPageConfigWhereUniqueInput
  }

  /**
   * JiraPageConfig deleteMany
   */
  export type JiraPageConfigDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which JiraPageConfigs to delete
     */
    where?: JiraPageConfigWhereInput
    /**
     * Limit how many JiraPageConfigs to delete.
     */
    limit?: number
  }

  /**
   * JiraPageConfig without action
   */
  export type JiraPageConfigDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JiraPageConfig
     */
    select?: JiraPageConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JiraPageConfig
     */
    omit?: JiraPageConfigOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    username: 'username',
    hashedPassword: 'hashedPassword',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const JiraConnectionSettingScalarFieldEnum: {
    id: 'id',
    baseUrl: 'baseUrl',
    email: 'email',
    apiToken: 'apiToken',
    updatedAt: 'updatedAt'
  };

  export type JiraConnectionSettingScalarFieldEnum = (typeof JiraConnectionSettingScalarFieldEnum)[keyof typeof JiraConnectionSettingScalarFieldEnum]


  export const JiraPageConfigScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    jql: 'jql',
    type: 'type',
    columns: 'columns',
    sortBy: 'sortBy',
    sortOrder: 'sortOrder',
    ownerId: 'ownerId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type JiraPageConfigScalarFieldEnum = (typeof JiraPageConfigScalarFieldEnum)[keyof typeof JiraPageConfigScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    hashedPassword?: StringFilter<"User"> | string
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    username?: SortOrder
    hashedPassword?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    username?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    hashedPassword?: StringFilter<"User"> | string
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
  }, "id" | "username">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    username?: SortOrder
    hashedPassword?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    username?: StringWithAggregatesFilter<"User"> | string
    hashedPassword?: StringWithAggregatesFilter<"User"> | string
    role?: EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type JiraConnectionSettingWhereInput = {
    AND?: JiraConnectionSettingWhereInput | JiraConnectionSettingWhereInput[]
    OR?: JiraConnectionSettingWhereInput[]
    NOT?: JiraConnectionSettingWhereInput | JiraConnectionSettingWhereInput[]
    id?: StringFilter<"JiraConnectionSetting"> | string
    baseUrl?: StringNullableFilter<"JiraConnectionSetting"> | string | null
    email?: StringNullableFilter<"JiraConnectionSetting"> | string | null
    apiToken?: StringNullableFilter<"JiraConnectionSetting"> | string | null
    updatedAt?: DateTimeFilter<"JiraConnectionSetting"> | Date | string
  }

  export type JiraConnectionSettingOrderByWithRelationInput = {
    id?: SortOrder
    baseUrl?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    apiToken?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
  }

  export type JiraConnectionSettingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: JiraConnectionSettingWhereInput | JiraConnectionSettingWhereInput[]
    OR?: JiraConnectionSettingWhereInput[]
    NOT?: JiraConnectionSettingWhereInput | JiraConnectionSettingWhereInput[]
    baseUrl?: StringNullableFilter<"JiraConnectionSetting"> | string | null
    email?: StringNullableFilter<"JiraConnectionSetting"> | string | null
    apiToken?: StringNullableFilter<"JiraConnectionSetting"> | string | null
    updatedAt?: DateTimeFilter<"JiraConnectionSetting"> | Date | string
  }, "id">

  export type JiraConnectionSettingOrderByWithAggregationInput = {
    id?: SortOrder
    baseUrl?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    apiToken?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    _count?: JiraConnectionSettingCountOrderByAggregateInput
    _max?: JiraConnectionSettingMaxOrderByAggregateInput
    _min?: JiraConnectionSettingMinOrderByAggregateInput
  }

  export type JiraConnectionSettingScalarWhereWithAggregatesInput = {
    AND?: JiraConnectionSettingScalarWhereWithAggregatesInput | JiraConnectionSettingScalarWhereWithAggregatesInput[]
    OR?: JiraConnectionSettingScalarWhereWithAggregatesInput[]
    NOT?: JiraConnectionSettingScalarWhereWithAggregatesInput | JiraConnectionSettingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"JiraConnectionSetting"> | string
    baseUrl?: StringNullableWithAggregatesFilter<"JiraConnectionSetting"> | string | null
    email?: StringNullableWithAggregatesFilter<"JiraConnectionSetting"> | string | null
    apiToken?: StringNullableWithAggregatesFilter<"JiraConnectionSetting"> | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"JiraConnectionSetting"> | Date | string
  }

  export type JiraPageConfigWhereInput = {
    AND?: JiraPageConfigWhereInput | JiraPageConfigWhereInput[]
    OR?: JiraPageConfigWhereInput[]
    NOT?: JiraPageConfigWhereInput | JiraPageConfigWhereInput[]
    id?: StringFilter<"JiraPageConfig"> | string
    title?: StringFilter<"JiraPageConfig"> | string
    description?: StringNullableFilter<"JiraPageConfig"> | string | null
    jql?: StringFilter<"JiraPageConfig"> | string
    type?: StringFilter<"JiraPageConfig"> | string
    columns?: StringNullableFilter<"JiraPageConfig"> | string | null
    sortBy?: StringNullableFilter<"JiraPageConfig"> | string | null
    sortOrder?: StringNullableFilter<"JiraPageConfig"> | string | null
    ownerId?: StringNullableFilter<"JiraPageConfig"> | string | null
    createdAt?: DateTimeFilter<"JiraPageConfig"> | Date | string
    updatedAt?: DateTimeFilter<"JiraPageConfig"> | Date | string
  }

  export type JiraPageConfigOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    jql?: SortOrder
    type?: SortOrder
    columns?: SortOrderInput | SortOrder
    sortBy?: SortOrderInput | SortOrder
    sortOrder?: SortOrderInput | SortOrder
    ownerId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type JiraPageConfigWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: JiraPageConfigWhereInput | JiraPageConfigWhereInput[]
    OR?: JiraPageConfigWhereInput[]
    NOT?: JiraPageConfigWhereInput | JiraPageConfigWhereInput[]
    title?: StringFilter<"JiraPageConfig"> | string
    description?: StringNullableFilter<"JiraPageConfig"> | string | null
    jql?: StringFilter<"JiraPageConfig"> | string
    type?: StringFilter<"JiraPageConfig"> | string
    columns?: StringNullableFilter<"JiraPageConfig"> | string | null
    sortBy?: StringNullableFilter<"JiraPageConfig"> | string | null
    sortOrder?: StringNullableFilter<"JiraPageConfig"> | string | null
    ownerId?: StringNullableFilter<"JiraPageConfig"> | string | null
    createdAt?: DateTimeFilter<"JiraPageConfig"> | Date | string
    updatedAt?: DateTimeFilter<"JiraPageConfig"> | Date | string
  }, "id">

  export type JiraPageConfigOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    jql?: SortOrder
    type?: SortOrder
    columns?: SortOrderInput | SortOrder
    sortBy?: SortOrderInput | SortOrder
    sortOrder?: SortOrderInput | SortOrder
    ownerId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: JiraPageConfigCountOrderByAggregateInput
    _max?: JiraPageConfigMaxOrderByAggregateInput
    _min?: JiraPageConfigMinOrderByAggregateInput
  }

  export type JiraPageConfigScalarWhereWithAggregatesInput = {
    AND?: JiraPageConfigScalarWhereWithAggregatesInput | JiraPageConfigScalarWhereWithAggregatesInput[]
    OR?: JiraPageConfigScalarWhereWithAggregatesInput[]
    NOT?: JiraPageConfigScalarWhereWithAggregatesInput | JiraPageConfigScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"JiraPageConfig"> | string
    title?: StringWithAggregatesFilter<"JiraPageConfig"> | string
    description?: StringNullableWithAggregatesFilter<"JiraPageConfig"> | string | null
    jql?: StringWithAggregatesFilter<"JiraPageConfig"> | string
    type?: StringWithAggregatesFilter<"JiraPageConfig"> | string
    columns?: StringNullableWithAggregatesFilter<"JiraPageConfig"> | string | null
    sortBy?: StringNullableWithAggregatesFilter<"JiraPageConfig"> | string | null
    sortOrder?: StringNullableWithAggregatesFilter<"JiraPageConfig"> | string | null
    ownerId?: StringNullableWithAggregatesFilter<"JiraPageConfig"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"JiraPageConfig"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"JiraPageConfig"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    username: string
    hashedPassword: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUncheckedCreateInput = {
    id?: string
    username: string
    hashedPassword: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    hashedPassword?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    hashedPassword?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateManyInput = {
    id?: string
    username: string
    hashedPassword: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    hashedPassword?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    hashedPassword?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JiraConnectionSettingCreateInput = {
    id?: string
    baseUrl?: string | null
    email?: string | null
    apiToken?: string | null
    updatedAt?: Date | string
  }

  export type JiraConnectionSettingUncheckedCreateInput = {
    id?: string
    baseUrl?: string | null
    email?: string | null
    apiToken?: string | null
    updatedAt?: Date | string
  }

  export type JiraConnectionSettingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    baseUrl?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    apiToken?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JiraConnectionSettingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    baseUrl?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    apiToken?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JiraConnectionSettingCreateManyInput = {
    id?: string
    baseUrl?: string | null
    email?: string | null
    apiToken?: string | null
    updatedAt?: Date | string
  }

  export type JiraConnectionSettingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    baseUrl?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    apiToken?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JiraConnectionSettingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    baseUrl?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    apiToken?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JiraPageConfigCreateInput = {
    id?: string
    title: string
    description?: string | null
    jql: string
    type?: string
    columns?: string | null
    sortBy?: string | null
    sortOrder?: string | null
    ownerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type JiraPageConfigUncheckedCreateInput = {
    id?: string
    title: string
    description?: string | null
    jql: string
    type?: string
    columns?: string | null
    sortBy?: string | null
    sortOrder?: string | null
    ownerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type JiraPageConfigUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    jql?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    columns?: NullableStringFieldUpdateOperationsInput | string | null
    sortBy?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JiraPageConfigUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    jql?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    columns?: NullableStringFieldUpdateOperationsInput | string | null
    sortBy?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JiraPageConfigCreateManyInput = {
    id?: string
    title: string
    description?: string | null
    jql: string
    type?: string
    columns?: string | null
    sortBy?: string | null
    sortOrder?: string | null
    ownerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type JiraPageConfigUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    jql?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    columns?: NullableStringFieldUpdateOperationsInput | string | null
    sortBy?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JiraPageConfigUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    jql?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    columns?: NullableStringFieldUpdateOperationsInput | string | null
    sortBy?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[]
    notIn?: $Enums.UserRole[]
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    hashedPassword?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    hashedPassword?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    hashedPassword?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[]
    notIn?: $Enums.UserRole[]
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type JiraConnectionSettingCountOrderByAggregateInput = {
    id?: SortOrder
    baseUrl?: SortOrder
    email?: SortOrder
    apiToken?: SortOrder
    updatedAt?: SortOrder
  }

  export type JiraConnectionSettingMaxOrderByAggregateInput = {
    id?: SortOrder
    baseUrl?: SortOrder
    email?: SortOrder
    apiToken?: SortOrder
    updatedAt?: SortOrder
  }

  export type JiraConnectionSettingMinOrderByAggregateInput = {
    id?: SortOrder
    baseUrl?: SortOrder
    email?: SortOrder
    apiToken?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type JiraPageConfigCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    jql?: SortOrder
    type?: SortOrder
    columns?: SortOrder
    sortBy?: SortOrder
    sortOrder?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type JiraPageConfigMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    jql?: SortOrder
    type?: SortOrder
    columns?: SortOrder
    sortBy?: SortOrder
    sortOrder?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type JiraPageConfigMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    jql?: SortOrder
    type?: SortOrder
    columns?: SortOrder
    sortBy?: SortOrder
    sortOrder?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[]
    notIn?: $Enums.UserRole[]
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[]
    notIn?: $Enums.UserRole[]
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}