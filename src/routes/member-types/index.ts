import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { changeMemberTypeBodySchema } from './schema';
import type { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<
    MemberTypeEntity[]
  > {
    return this.db.memberTypes.findMany()
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity | void> {
      const paramsValidationFunction = request.getValidationFunction('params')
      const isValidParams = paramsValidationFunction(request.params)

      if (!isValidParams) {
        return reply.badRequest()
      }

      const memberType = await this.db.memberTypes.findOne({
        key: "id", equals: request.params.id
      })

      if (!memberType) {
         throw this.httpErrors.notFound()
      }

      return memberType
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeMemberTypeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      return await this.db.memberTypes.change(request.params.id, request.body)
    }
  );
};

export default plugin;
