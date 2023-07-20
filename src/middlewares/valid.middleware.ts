import { Request, Response, NextFunction } from "express";
import { ExpressUtils } from "../utils";

/* Animals */
export function validateUpdateAnimalByNameRequest(req: Request, res: Response, next: NextFunction): void {
    const name = req.params.name.trim().toLowerCase();
    if (!ExpressUtils.isValid(res, name, 'string', 2, 50)) {
        return;
    }

    const {
        description,
        image,
        species,
        age,
        enclosure
    } = req.body;

    // Trim and lowercase all string values and check if they are valid
    const trimmedDescription = description ? description.trim() : undefined;
    const trimmedImage = image ? image.trim() : undefined;
    const trimmedSpecies = species ? species.trim().toLowerCase() : undefined;
    let trimmedEnclosure;
    if(typeof enclosure == "string"){
      trimmedEnclosure = enclosure.trim();
    }else{
      trimmedEnclosure = enclosure ? enclosure.name.trim() : undefined;
    }

    if (
        (!description || ExpressUtils.isValid(res, trimmedDescription, 'string', 0, 500)) &&
        (!image || ExpressUtils.isImageUrlOrPath(trimmedImage)) &&
        (!species || ExpressUtils.isValid(res, trimmedSpecies, 'string', 2, 30)) &&
        (!age || ExpressUtils.isValid(res, age, 'number', 1, 150)) &&
        (!enclosure || ExpressUtils.isValid(res, trimmedEnclosure, 'string', 2, 50))
    ) {
        next();
    } else {
        ExpressUtils.badRequest(res);
    }
}

export function validateCreateAnimalRequest(req: Request, res: Response, next: NextFunction): void {
    const {
        name,
        description,
        image,
        species,
        age,
        enclosure
    } = req.body;

    // Trim and lowercase all string values and check if they are valid
    const trimmedName = name ? name.trim().toLowerCase() : undefined;
    const trimmedDescription = description ? description.trim() : undefined;
    const trimmedImage = image ? image.trim() : undefined;
    const trimmedSpecies = species ? species.trim().toLowerCase() : undefined;
    const trimmedEnclosure = enclosure ? enclosure.trim() : undefined;    

    if (
        ExpressUtils.isValid(res, trimmedName, 'string', 2, 50) && 
        ExpressUtils.isValid(res, trimmedDescription, 'string', 0, 500) &&
        ExpressUtils.isImageUrlOrPath(trimmedImage) &&
        ExpressUtils.isValid(res, trimmedSpecies, 'string', 2, 30) &&
        age && ExpressUtils.isValid(res, age, 'number', 1, 150) &&
        ExpressUtils.isValid(res, trimmedEnclosure, 'string', 2, 50)
    ) {
        next();
    } else {
        ExpressUtils.badRequest(res);
    }
}

/* Enclosures */
export function validateUpdateByNameRequest(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const name = req.params.name.trim().toLowerCase();
  if (!ExpressUtils.isValid(res, name, "string", 2, 50)) {
    ExpressUtils.badRequest(res);
    return;
  }

  const {
    description,
    image,
    type,
    capacity,
    openingHours,
    duration,
    status,
    bestMaintenanceMonth,
    handicapAccessible,
  } = req.body;

  // Trim and lowercase all string values
  const trimmedDescription = description ? description.trim() : undefined;
  const trimmedImage = image ? image.trim() : undefined;
  const trimmedType = type ? type.trim().toLowerCase() : undefined;
  const trimmedOpeningHours = openingHours ? openingHours.trim() : undefined;

  if (description && !ExpressUtils.isValid(res, trimmedDescription, "string", 0, 500)) {
    ExpressUtils.badRequest(res);
    return;
  }
  if (image && !ExpressUtils.isImageUrlOrPath(trimmedImage)) {
    ExpressUtils.badRequest(res);
    return;
  }
  if (type && !ExpressUtils.isValid(res, trimmedType, "string", 2, 30)) {
    ExpressUtils.badRequest(res);
    return;
  }
  if (capacity && !ExpressUtils.isValid(res, capacity, "number", 1, 10000)) {
    ExpressUtils.badRequest(res);
    return;
  }
  if (openingHours && !ExpressUtils.isValid(res, trimmedOpeningHours, "string", 11, 11)) {
    ExpressUtils.badRequest(res);
    return;
  }
  if (duration && !ExpressUtils.isValid(res, duration, "number", 0, 1440)) {
    ExpressUtils.badRequest(res);
    return;
  }
  if (status !== undefined && !ExpressUtils.isValid(res, status, "boolean")) {
    ExpressUtils.badRequest(res);
    return;
  }
  if (bestMaintenanceMonth && !ExpressUtils.isValid(res, bestMaintenanceMonth, "number", 1, 12)) {
    ExpressUtils.badRequest(res);
    return;
  }
  if (handicapAccessible !== undefined && !ExpressUtils.isValid(res, handicapAccessible, "boolean")) {
    ExpressUtils.badRequest(res);
    return;
  }

  next();
}


export function validateCreateRequest(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const {
    name,
    description,
    image,
    type,
    capacity,
    openingHours,
    duration,
    status,
    bestMaintenanceMonth,
    handicapAccessible,
  } = req.body;

  // Trim and lowercase all string values
  const trimmedName = name ? name.trim().toLowerCase() : undefined;
  const trimmedDescription = description ? description.trim() : undefined;
  const trimmedImage = image ? image.trim() : undefined;
  const trimmedType = type ? type.trim().toLowerCase() : undefined;
  const trimmedOpeningHours = openingHours ? openingHours.trim() : undefined;

  if (!ExpressUtils.isValid(res, trimmedName, "string", 2, 50)) {
    ExpressUtils.badRequest(res);
    return;
  }
  if (!ExpressUtils.isValid(res, trimmedDescription, "string", 0, 500)) {
    ExpressUtils.badRequest(res);
    return;
  }
  if (!ExpressUtils.isImageUrlOrPath(trimmedImage)) {
    ExpressUtils.badRequest(res);
    return;
  }
  if (!ExpressUtils.isValid(res, trimmedType, "string", 2, 30)) {
    ExpressUtils.badRequest(res);
    return;
  }
  if (!capacity || !ExpressUtils.isValid(res, capacity, "number", 1, 10000)) {
    ExpressUtils.badRequest(res);
    return;
  }
  if (!ExpressUtils.isValid(res, trimmedOpeningHours, "string", 11, 11)) {
    ExpressUtils.badRequest(res);
    return;
  }
  if (!duration || !ExpressUtils.isValid(res, duration, "number", 0, 1440)) {
    ExpressUtils.badRequest(res);
    return;
  }
  if (status === undefined || !ExpressUtils.isValid(res, status, "boolean")) {
    ExpressUtils.badRequest(res);
    return;
  }
  if (handicapAccessible === undefined || !ExpressUtils.isValid(res, handicapAccessible, "boolean")) {
    ExpressUtils.badRequest(res);
    return;
  }
  if (bestMaintenanceMonth && !ExpressUtils.isValid(res, bestMaintenanceMonth, "number", 1, 12)) {
    ExpressUtils.badRequest(res);
    return;
  }

  next();
}


/* user */
export function validateCreateUser(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { login, password, role, active, workShift } = req.body;

  // Trim and lowercase some values
  const trimmedLogin = login ? login.trim().toLowerCase() : undefined;
  const trimmedPassword = password ? password.trim() : undefined;
  const trimmedRole = role ? role.trim().toLowerCase() : undefined;
  const isDeclaredActive = active !== undefined ? active : true; // default: true if not declared

  if (!ExpressUtils.isValid(res, trimmedLogin, "string", 4, 30)) {
    ExpressUtils.badRequest(res);
    return;
  }
  if (!ExpressUtils.isValid(res, trimmedPassword, "string", 8)) {
    ExpressUtils.badRequest(res);
    return;
  }
  if (!trimmedRole || !ExpressUtils.isValid(res, trimmedRole, "string", 2, 30)) {
    ExpressUtils.badRequest(res);
    return;
  }
  if (!ExpressUtils.isValid(res, isDeclaredActive, "boolean")) {
    ExpressUtils.badRequest(res);
    return;
  }

  // Check if workShift is an array of 3 elements and if each element is valid
  if (!workShift || !ExpressUtils.isValid(res, workShift, "array", 1, 7)) {
    ExpressUtils.badRequest(res);
    return;
  }

  const trimmedWorkShift = workShift.map(
    (shift: { day: string; start: string; end: string }) => {
      return {
        day: shift.day.trim().toLowerCase(),
        start: shift.start.trim(),
        end: shift.end.trim(),
      };
    }
  ) as { day: string; start: string; end: string }[];

  const isValidShift = trimmedWorkShift.every(
    (shift: { day: string; start: string; end: string }) => {
      const validDaysOfWeek =
        /^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/;
      const isValidDay = validDaysOfWeek.test(shift.day);

      return (
        isValidDay &&
        ExpressUtils.isValid(res, shift.start, "string", 5, 5) &&
        ExpressUtils.isValid(res, shift.end, "string", 5, 5)
      );
    }
  );

  if (!isValidShift) {
    ExpressUtils.badRequest(res);
    return;
  }

  next();
}


export function validateLoginUser(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { login, password } = req.body;

  // Trim and lowercase some values and check if they are valid
  const trimmedLogin = login ? login.trim().toLowerCase() : undefined;
  const trimmedPassword = password ? password.trim() : undefined;

  if (
    ExpressUtils.isValid(res, trimmedLogin, "string", 4, 30) &&
    ExpressUtils.isValid(res, trimmedPassword, "string", 8)
  ) {
    next();
  } else {
    ExpressUtils.badRequest(res);
  }
}

export function validateUpdateUser(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const login = req.params.login.trim().toLowerCase();
  if (!ExpressUtils.isValid(res, login, "string", 4, 30)) {
    ExpressUtils.badRequest(res);
    return;
  }

  const { password, role, active, workShift } = req.body;

  // Trim and lowercase some values and check if they are valid
  const trimmedPassword = password.trim();
  const trimmedRole = role ? role.trim().toLowerCase() : undefined;
  const isDeclaredActive = active !== undefined ? active : true; // default: true if not declared
  const trimmedWorkShift = workShift
    ? (workShift.map((shift: { day: string; start: string; end: string }) => {
        return {
          day: shift.day.trim().toLowerCase(),
          start: shift.start.trim(),
          end: shift.end.trim(),
        };
      }) as { day: string; start: string; end: string }[])
    : undefined;

  if (!ExpressUtils.isValid(res, trimmedPassword, "string", 8)) {
    ExpressUtils.badRequest(res);
    return;
  }
  
  if (role && !ExpressUtils.isValid(res, trimmedRole, "string", 2, 30)) {
    ExpressUtils.badRequest(res);
    return;
  }

  if (active && !ExpressUtils.isValid(res, isDeclaredActive, "boolean")) {
    ExpressUtils.badRequest(res);
    return;
  }

  console.log(workShift);
  
  if (workShift && trimmedWorkShift) {
    if (!ExpressUtils.isValid(res, trimmedWorkShift, "array", 1, 7)) {
      ExpressUtils.badRequest(res);
      return;
    }
    for (let shift of trimmedWorkShift) {
      const validDaysOfWeek =
        /^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/;
      const isValidDay = validDaysOfWeek.test(shift.day);
      if (
        !isValidDay ||
        !ExpressUtils.isValid(res, shift.start, "string", 5, 5) ||
        !ExpressUtils.isValid(res, shift.end, "string", 5, 5)
      ) {
        ExpressUtils.badRequest(res);
        return;
      }
    }
  }

  next();
}
