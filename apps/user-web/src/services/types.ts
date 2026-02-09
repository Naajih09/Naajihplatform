import {
  BaseQueryFn,
  EndpointBuilder,
  FetchArgs,
  FetchBaseQueryError,
  QueryActionCreatorResult,
  QueryDefinition,
} from '@reduxjs/toolkit/query';

export const apiTagTypes = ['Users', 'User'] as const;

export type TApiTag = (typeof apiTagTypes)[number];

export type TQueryActionCreatorResult = QueryActionCreatorResult<
  QueryDefinition<
    unknown,
    BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
    TApiTag,
    unknown,
    'api'
  >
>;

export type TAppEndpointBuilder = EndpointBuilder<
  BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
  TApiTag,
  'api'
>;
