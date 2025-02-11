import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateWorkspace = mutation({
    args: {
        messages: v.array(v.object({
            role: v.string(),
            content: v.string()
        })),
        user: v.id('users')
    },
    handler: async (ctx, args) => {
        const workspaceId = await ctx.db.insert('workspace', {
            messages: args.messages,
            user: args.user
        });
        return workspaceId;
    }
});

export const GetWorkspace = query({
    args: {
        workspaceId: v.string()
    },
    handler: async (ctx, args) => {
        const workspace = await ctx.db.get(args.workspaceId);
        return workspace;
    }
});

export const GetUserWorkspaces = query({
    args: {
        userId: v.id('users')
    },
    handler: async (ctx, args) => {
        const workspaces = await ctx.db
            .query('workspace')
            .filter(q => q.eq(q.field('user'), args.userId))
            .collect();
        return workspaces;
    }
});

export const UpdateMessages = mutation({
    args: {
        workspaceId: v.string(),
        messages: v.array(v.object({
            role: v.string(),
            content: v.string()
        }))
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.patch(args.workspaceId, {
            messages: args.messages
        });
        return result;
    }
});

export const UpdateFiles = mutation({
    args: {
        workspaceId: v.string(),
        files: v.any()
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.patch(args.workspaceId, {
            files: args.files
        });
        return result;
    }
});