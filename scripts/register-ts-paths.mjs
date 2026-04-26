import { existsSync, statSync } from "node:fs";
import { registerHooks } from "node:module";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const sourceRoot = join(projectRoot, "src");
const extensions = [".ts", ".tsx", ".mts", ".js", ".mjs"];

function isProjectFile(filePath) {
  return filePath.startsWith(projectRoot) && !filePath.includes("/node_modules/");
}

function resolveExistingPath(candidatePath) {
  if (existsSync(candidatePath)) {
    const stats = statSync(candidatePath);

    if (stats.isFile()) {
      return candidatePath;
    }

    if (stats.isDirectory()) {
      for (const extension of extensions) {
        const indexPath = join(candidatePath, `index${extension}`);

        if (existsSync(indexPath) && statSync(indexPath).isFile()) {
          return indexPath;
        }
      }
    }
  }

  if (extname(candidatePath)) {
    return null;
  }

  for (const extension of extensions) {
    const pathWithExtension = `${candidatePath}${extension}`;

    if (existsSync(pathWithExtension) && statSync(pathWithExtension).isFile()) {
      return pathWithExtension;
    }
  }

  return null;
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      const resolvedPath = resolveExistingPath(
        join(sourceRoot, specifier.slice(2))
      );

      if (resolvedPath) {
        return {
          shortCircuit: true,
          url: pathToFileURL(resolvedPath).href,
        };
      }
    }

    if (
      specifier.startsWith(".") &&
      context.parentURL?.startsWith("file://")
    ) {
      const parentPath = fileURLToPath(context.parentURL);

      if (!isProjectFile(parentPath)) {
        return nextResolve(specifier, context);
      }

      const resolvedPath = resolveExistingPath(
        resolve(dirname(parentPath), specifier)
      );

      if (resolvedPath) {
        return {
          shortCircuit: true,
          url: pathToFileURL(resolvedPath).href,
        };
      }
    }

    return nextResolve(specifier, context);
  },
});
