/**
 * Tests unitaires pour TombolaValidation
 * À utiliser avec Jest ou Vitest
 * 
 * Les fonctions describe/it/expect sont des globals fournies par Jest/Vitest
 * Exécuter avec: npm test (une fois Jest/Vitest configuré)
 */

import TombolaValidation from "@/lib/tombola-validation";

// Types pour TypeScript (si Jest/Vitest n'est pas encore installé)
declare global {
  function describe(name: string, fn: () => void): void;
  function it(name: string, fn: () => void): void;
  function expect(value: any): {
    toBe: (val: any) => void;
    toHaveLength: (val: number) => void;
    toBeGreaterThan: (val: number) => void;
    toContain: (val: any) => void;
    not: { toContain: (val: any) => void };
  };
}

describe("TombolaValidation", () => {
  describe("Email validation", () => {
    it("should accept valid emails", () => {
      expect(TombolaValidation.isValidEmail("marie@example.com")).toBe(true);
      expect(TombolaValidation.isValidEmail("jean.dupont@école.fr")).toBe(true);
      expect(
        TombolaValidation.isValidEmail("parent+enfant@sub.domain.org")
      ).toBe(true);
    });

    it("should reject invalid emails", () => {
      expect(TombolaValidation.isValidEmail("invalid")).toBe(false);
      expect(TombolaValidation.isValidEmail("@example.com")).toBe(false);
      expect(TombolaValidation.isValidEmail("marie@")).toBe(false);
      expect(TombolaValidation.isValidEmail("marie @example.com")).toBe(false);
      expect(TombolaValidation.isValidEmail("")).toBe(false);
    });

    it("should trim whitespace", () => {
      expect(TombolaValidation.isValidEmail("  marie@example.com  ")).toBe(
        true
      );
    });
  });

  describe("Prenom validation", () => {
    it("should accept valid prenoms", () => {
      expect(TombolaValidation.isValidPrenom("Marie")).toBe(true);
      expect(TombolaValidation.isValidPrenom("Jean-Pierre")).toBe(true);
      expect(TombolaValidation.isValidPrenom("Al")).toBe(true);
    });

    it("should reject invalid prenoms", () => {
      expect(TombolaValidation.isValidPrenom("A")).toBe(false); // Too short
      expect(TombolaValidation.isValidPrenom("")).toBe(false); // Empty
      expect(
        TombolaValidation.isValidPrenom("A".repeat(51))
      ).toBe(false); // Too long
    });
  });

  describe("Emoji validation", () => {
    it("should accept valid emojis", () => {
      expect(TombolaValidation.isValidEmoji("😊")).toBe(true);
      expect(TombolaValidation.isValidEmoji("🎁")).toBe(true);
      expect(TombolaValidation.isValidEmoji("✨")).toBe(true);
    });

    it("should reject invalid emojis", () => {
      expect(TombolaValidation.isValidEmoji("")).toBe(false); // Empty
      expect(TombolaValidation.isValidEmoji("12345")).toBe(false); // Too long
    });
  });

  describe("Lot title validation", () => {
    it("should accept valid titles", () => {
      expect(
        TombolaValidation.isValidLotTitle("Tablette 10 pouces")
      ).toBe(true);
      expect(TombolaValidation.isValidLotTitle("abc")).toBe(true);
    });

    it("should reject invalid titles", () => {
      expect(TombolaValidation.isValidLotTitle("ab")).toBe(false); // Too short
      expect(TombolaValidation.isValidLotTitle("")).toBe(false); // Empty
      expect(
        TombolaValidation.isValidLotTitle("A".repeat(101))
      ).toBe(false); // Too long
    });
  });

  describe("Parent registration validation", () => {
    it("should accept valid registration", () => {
      const { valid, errors } = TombolaValidation.validateParentRegistration({
        prenom: "Marie",
        email: "marie@example.com",
        emoji: "🌿",
      });
      expect(valid).toBe(true);
      expect(errors).toHaveLength(0);
    });

    it("should reject invalid email", () => {
      const { valid, errors } =
        TombolaValidation.validateParentRegistration({
          prenom: "Marie",
          email: "invalid-email",
          emoji: "🌿",
        });
      expect(valid).toBe(false);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain("email");
    });

    it("should reject short prenom", () => {
      const { valid, errors } =
        TombolaValidation.validateParentRegistration({
          prenom: "A",
          email: "marie@example.com",
          emoji: "🌿",
        });
      expect(valid).toBe(false);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe("Email duplicate check", () => {
    const existingParents = [
      { email: "marie@example.com" },
      { email: "jean@example.com" },
    ];

    it("should detect duplicates", () => {
      expect(
        TombolaValidation.checkEmailDuplicate("marie@example.com", existingParents)
      ).toBe(true);
    });

    it("should not flag non-duplicates", () => {
      expect(
        TombolaValidation.checkEmailDuplicate("pierre@example.com", existingParents)
      ).toBe(false);
    });

    it("should be case-insensitive", () => {
      expect(
        TombolaValidation.checkEmailDuplicate("MARIE@EXAMPLE.COM", existingParents)
      ).toBe(true);
    });
  });

  describe("Parent existence check", () => {
    const parents = [{ id: "1" }, { id: "2" }];

    it("should confirm parent exists", () => {
      expect(TombolaValidation.parentExists("1", parents)).toBe(true);
    });

    it("should confirm parent does not exist", () => {
      expect(TombolaValidation.parentExists("999", parents)).toBe(false);
    });

    it("should handle null parentId", () => {
      expect(TombolaValidation.parentExists(null, parents)).toBe(false);
    });
  });

  describe("Orphan lot detection", () => {
    const parents = [{ id: "p1" }, { id: "p2" }];

    it("should detect orphan lots", () => {
      const lots = [
        { id: "l1", parentId: "p1" },
        { id: "l2", parentId: "p2" },
        { id: "l3", parentId: "p999" }, // Orphan
      ];

      const { isValid, orphanLots } = TombolaValidation.checkForOrphanLots(
        lots,
        parents
      );
      expect(isValid).toBe(false);
      expect(orphanLots).toContain("l3");
      expect(orphanLots).toHaveLength(1);
    });

    it("should confirm no orphans", () => {
      const lots = [
        { id: "l1", parentId: "p1" },
        { id: "l2", parentId: "p2" },
      ];

      const { isValid, orphanLots } = TombolaValidation.checkForOrphanLots(
        lots,
        parents
      );
      expect(isValid).toBe(true);
      expect(orphanLots).toHaveLength(0);
    });
  });

  describe("Lot reservation validation", () => {
    it("should allow reservation by different parent", () => {
      expect(TombolaValidation.canReserveLot("parent1", "parent2")).toBe(true);
    });

    it("should prevent self-reservation", () => {
      expect(TombolaValidation.canReserveLot("parent1", "parent1")).toBe(false);
    });
  });

  describe("Get parent lots", () => {
    it("should return all parent lots", () => {
      const lots = [
        { id: "l1", parentId: "p1" },
        { id: "l2", parentId: "p1" },
        { id: "l3", parentId: "p2" },
      ];

      const parentLots = TombolaValidation.getParentLots("p1", lots);
      expect(parentLots).toHaveLength(2);
      expect(parentLots).toContain("l1");
      expect(parentLots).toContain("l2");
      expect(parentLots).not.toContain("l3");
    });

    it("should return empty array for parent with no lots", () => {
      const lots = [{ id: "l1", parentId: "p1" }];

      const parentLots = TombolaValidation.getParentLots("p999", lots);
      expect(parentLots).toHaveLength(0);
    });
  });
});
