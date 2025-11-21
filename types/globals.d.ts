export { }

declare global {
    interface CustomJwtSessionClaims {
        publicMetadata: {
            businessId?: string;
            businessType?: string;
        };
    }
}
