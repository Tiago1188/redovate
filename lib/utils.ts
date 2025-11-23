import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSubdomainFromHost(host: string, rootDomain: string = "myredovate.com"): string | null {
  host = host.replace(/^https?:\/\//, ""); // Remove protocol if present
  
  const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");
  
  if (isLocalhost) {
    // Handle localhost (e.g., malbork.localhost:3000)
    // Remove port if present
    const hostWithoutPort = host.split(":")[0];
    
    // If it's just localhost or 127.0.0.1, no subdomain
    if (hostWithoutPort === "localhost" || hostWithoutPort === "127.0.0.1") return null;
    
    // Extract subdomain parts
    const parts = hostWithoutPort.split(".");
    // Remove the last part (localhost or ip segment)
    // For localhost, parts might be ["malbork", "localhost"]
    // For 127.0.0.1, this logic is tricky, usually we just assume .localhost
    
    if (host.includes("localhost")) {
         // Assuming format: subdomain.localhost:port or subdomain.localhost
         const parts = host.split(".localhost");
         if (parts[0] && parts[0] !== "") return parts[0];
    }
    return null;
  }
  
  // Production handling
  if (host === rootDomain || host === `www.${rootDomain}`) return null;
  
  if (host.endsWith(`.${rootDomain}`)) {
    return host.replace(`.${rootDomain}`, "");
  }
  
  return null;
}
